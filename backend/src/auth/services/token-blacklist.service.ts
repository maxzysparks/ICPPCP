import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/**
 * Entity for storing blacklisted tokens
 * Used for immediate token invalidation on logout
 */
@Entity('blacklisted_tokens')
@Index(['token'])
@Index(['expiresAt'])
export class BlacklistedToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  token: string;

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column()
  reason: string; // 'logout', 'password_change', 'security_revoke'

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}

/**
 * Service for managing token blacklist
 * Provides immediate token invalidation capability
 */
@Injectable()
export class TokenBlacklistService {
  // In-memory cache for faster lookups (with TTL)
  private cache: Map<string, Date> = new Map();
  private readonly cacheMaxSize = 10000;
  private cleanupInterval: NodeJS.Timeout;

  constructor(
    @InjectRepository(BlacklistedToken)
    private readonly blacklistRepository: Repository<BlacklistedToken>,
  ) {
    // Clean up expired tokens every hour
    this.cleanupInterval = setInterval(
      () => this.cleanupExpiredTokens(),
      60 * 60 * 1000,
    );
  }

  /**
   * Add a token to the blacklist
   * @param token - The JWT token to blacklist
   * @param userId - The user ID associated with the token
   * @param reason - Reason for blacklisting
   * @param expiresAt - When the token would naturally expire
   */
  async blacklistToken(
    token: string,
    userId: string,
    reason: string,
    expiresAt: Date,
  ): Promise<void> {
    // Add to database
    const blacklistedToken = this.blacklistRepository.create({
      token: this.hashToken(token),
      userId,
      reason,
      expiresAt,
    });

    try {
      await this.blacklistRepository.save(blacklistedToken);
    } catch (error: any) {
      // Ignore duplicate key errors (token already blacklisted)
      if (error.code !== '23505') {
        throw error;
      }
    }

    // Add to cache
    this.addToCache(token, expiresAt);
  }

  /**
   * Check if a token is blacklisted
   * @param token - The JWT token to check
   * @returns true if blacklisted, false otherwise
   */
  async isBlacklisted(token: string): Promise<boolean> {
    const hashedToken = this.hashToken(token);

    // Check cache first
    if (this.cache.has(hashedToken)) {
      const expiresAt = this.cache.get(hashedToken)!;
      if (expiresAt > new Date()) {
        return true;
      }
      // Token expired, remove from cache
      this.cache.delete(hashedToken);
    }

    // Check database
    const blacklistedToken = await this.blacklistRepository.findOne({
      where: { token: hashedToken },
    });

    if (blacklistedToken) {
      if (blacklistedToken.expiresAt > new Date()) {
        // Add to cache for faster future lookups
        this.addToCache(token, blacklistedToken.expiresAt);
        return true;
      }
    }

    return false;
  }

  /**
   * Blacklist all tokens for a user (e.g., on password change)
   * @param userId - The user ID
   * @param reason - Reason for blacklisting
   */
  async blacklistAllUserTokens(userId: string, reason: string): Promise<void> {
    // Since we don't store all active tokens, we'll rely on
    // the JWT strategy to check the user's tokenVersion
    // This is handled in the auth service by incrementing tokenVersion
    console.log(`Blacklisting all tokens for user ${userId}: ${reason}`);
  }

  /**
   * Clean up expired tokens from database and cache
   */
  async cleanupExpiredTokens(): Promise<void> {
    // Clean database
    await this.blacklistRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    // Clean cache
    const now = new Date();
    for (const [token, expiresAt] of this.cache.entries()) {
      if (expiresAt <= now) {
        this.cache.delete(token);
      }
    }
  }

  /**
   * Hash token for storage (don't store raw tokens)
   */
  private hashToken(token: string): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Add token to cache with size limit
   */
  private addToCache(token: string, expiresAt: Date): void {
    const hashedToken = this.hashToken(token);

    // Evict oldest entries if cache is full
    if (this.cache.size >= this.cacheMaxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(hashedToken, expiresAt);
  }

  /**
   * Cleanup on module destroy
   */
  onModuleDestroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}
