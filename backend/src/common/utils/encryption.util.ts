import * as crypto from 'crypto';
import { CipherGCM, DecipherGCM } from 'crypto';
import { ConfigService } from '@nestjs/config';

/**
 * Encryption utility for PHI (Protected Health Information) data at rest
 * Uses AES-256-GCM for authenticated encryption
 */
export class EncryptionUtil {
  private static algorithm = 'aes-256-gcm';
  private static ivLength = 16; // 128 bits
  private static saltLength = 64; // 512 bits
  private static tagLength = 16; // 128 bits
  private static keyLength = 32; // 256 bits
  private static iterations = 100000; // PBKDF2 iterations

  /**
   * Encrypt sensitive data
   * @param plaintext - The data to encrypt
   * @param encryptionKey - The encryption key from environment
   * @returns Encrypted string in format: salt:iv:authTag:ciphertext (all base64)
   */
  static encrypt(plaintext: string, encryptionKey: string): string {
    if (!plaintext) return plaintext;
    if (!encryptionKey) {
      throw new Error('Encryption key is required');
    }

    // Generate random salt and IV
    const salt = crypto.randomBytes(this.saltLength);
    const iv = crypto.randomBytes(this.ivLength);

    // Derive key using PBKDF2
    const key = crypto.pbkdf2Sync(
      encryptionKey,
      salt,
      this.iterations,
      this.keyLength,
      'sha512',
    );

    // Create cipher
    const cipher = crypto.createCipheriv(this.algorithm, key, iv) as CipherGCM;

    // Encrypt
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);

    // Get auth tag
    const authTag = cipher.getAuthTag();

    // Combine all parts: salt:iv:authTag:ciphertext
    return [
      salt.toString('base64'),
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted.toString('base64'),
    ].join(':');
  }

  /**
   * Decrypt sensitive data
   * @param encryptedData - The encrypted string
   * @param encryptionKey - The encryption key from environment
   * @returns Decrypted plaintext
   */
  static decrypt(encryptedData: string, encryptionKey: string): string {
    if (!encryptedData) return encryptedData;
    if (!encryptionKey) {
      throw new Error('Encryption key is required');
    }

    // Split the encrypted data
    const parts = encryptedData.split(':');
    if (parts.length !== 4) {
      throw new Error('Invalid encrypted data format');
    }

    const [saltB64, ivB64, authTagB64, ciphertextB64] = parts;

    // Decode from base64
    const salt = Buffer.from(saltB64, 'base64');
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const ciphertext = Buffer.from(ciphertextB64, 'base64');

    // Derive key using PBKDF2
    const key = crypto.pbkdf2Sync(
      encryptionKey,
      salt,
      this.iterations,
      this.keyLength,
      'sha512',
    );

    // Create decipher
    const decipher = crypto.createDecipheriv(this.algorithm, key, iv) as DecipherGCM;
    decipher.setAuthTag(authTag);

    // Decrypt
    const decrypted = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);

    return decrypted.toString('utf8');
  }

  /**
   * Hash sensitive data (one-way, for comparison)
   * @param data - The data to hash
   * @returns SHA-256 hash
   */
  static hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate a secure random token
   * @param length - Token length in bytes (default 32)
   * @returns Hex-encoded random token
   */
  static generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Mask sensitive data for display (e.g., SSN: ***-**-1234)
   * @param data - The data to mask
   * @param visibleChars - Number of characters to show at the end
   * @param maskChar - Character to use for masking
   */
  static maskData(
    data: string,
    visibleChars: number = 4,
    maskChar: string = '*',
  ): string {
    if (!data || data.length <= visibleChars) return data;
    const masked = maskChar.repeat(data.length - visibleChars);
    return masked + data.slice(-visibleChars);
  }
}

/**
 * Injectable encryption service for use in NestJS
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptionService {
  private encryptionKey: string;

  constructor(private configService: ConfigService) {
    this.encryptionKey = this.configService.get<string>('ENCRYPTION_KEY') || '';
    if (!this.encryptionKey && process.env.NODE_ENV === 'production') {
      throw new Error('ENCRYPTION_KEY must be set in production');
    }
  }

  encrypt(plaintext: string): string {
    if (!this.encryptionKey) {
      console.warn('Encryption key not set, returning plaintext');
      return plaintext;
    }
    return EncryptionUtil.encrypt(plaintext, this.encryptionKey);
  }

  decrypt(encryptedData: string): string {
    if (!this.encryptionKey) {
      console.warn('Encryption key not set, returning data as-is');
      return encryptedData;
    }
    try {
      return EncryptionUtil.decrypt(encryptedData, this.encryptionKey);
    } catch {
      // If decryption fails, data might not be encrypted
      return encryptedData;
    }
  }

  hash(data: string): string {
    return EncryptionUtil.hash(data);
  }

  generateToken(length?: number): string {
    return EncryptionUtil.generateSecureToken(length);
  }

  mask(data: string, visibleChars?: number): string {
    return EncryptionUtil.maskData(data, visibleChars);
  }
}
