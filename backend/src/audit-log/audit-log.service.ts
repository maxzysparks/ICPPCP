import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AuditLog, AuditAction, AuditResource } from './entities/audit-log.entity';

export interface AuditLogContext {
  userId?: string;
  userEmail?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  requestMethod?: string;
  requestUrl?: string;
}

export interface CreateAuditLogDto {
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  patientId?: string;
  previousData?: Record<string, any>;
  newData?: Record<string, any>;
  metadata?: Record<string, any>;
  success?: boolean;
  errorMessage?: string;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(
    dto: CreateAuditLogDto,
    context: AuditLogContext = {},
  ): Promise<AuditLog> {
    // Sanitize sensitive data before logging
    const sanitizedPreviousData = this.sanitizeSensitiveData(dto.previousData);
    const sanitizedNewData = this.sanitizeSensitiveData(dto.newData);

    const auditLog = this.auditLogRepository.create({
      ...dto,
      ...context,
      previousData: sanitizedPreviousData,
      newData: sanitizedNewData,
      success: dto.success ?? true,
    });

    return this.auditLogRepository.save(auditLog);
  }

  // Convenience methods for common actions
  async logCreate(
    resource: AuditResource,
    resourceId: string,
    newData: Record<string, any>,
    context: AuditLogContext,
    patientId?: string,
  ): Promise<AuditLog> {
    return this.log(
      {
        action: AuditAction.CREATE,
        resource,
        resourceId,
        newData,
        patientId,
      },
      context,
    );
  }

  async logRead(
    resource: AuditResource,
    resourceId: string,
    context: AuditLogContext,
    patientId?: string,
  ): Promise<AuditLog> {
    return this.log(
      {
        action: AuditAction.READ,
        resource,
        resourceId,
        patientId,
      },
      context,
    );
  }

  async logUpdate(
    resource: AuditResource,
    resourceId: string,
    previousData: Record<string, any>,
    newData: Record<string, any>,
    context: AuditLogContext,
    patientId?: string,
  ): Promise<AuditLog> {
    return this.log(
      {
        action: AuditAction.UPDATE,
        resource,
        resourceId,
        previousData,
        newData,
        patientId,
      },
      context,
    );
  }

  async logDelete(
    resource: AuditResource,
    resourceId: string,
    previousData: Record<string, any>,
    context: AuditLogContext,
    patientId?: string,
  ): Promise<AuditLog> {
    return this.log(
      {
        action: AuditAction.DELETE,
        resource,
        resourceId,
        previousData,
        patientId,
      },
      context,
    );
  }

  async logLogin(
    userId: string,
    success: boolean,
    context: AuditLogContext,
    errorMessage?: string,
  ): Promise<AuditLog> {
    return this.log(
      {
        action: success ? AuditAction.LOGIN : AuditAction.LOGIN_FAILED,
        resource: AuditResource.AUTH,
        resourceId: userId,
        success,
        errorMessage,
      },
      { ...context, userId },
    );
  }

  async logLogout(userId: string, context: AuditLogContext): Promise<AuditLog> {
    return this.log(
      {
        action: AuditAction.LOGOUT,
        resource: AuditResource.AUTH,
        resourceId: userId,
      },
      { ...context, userId },
    );
  }

  // Query methods for audit reports
  async findByUser(
    userId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AuditLog[]> {
    const where: any = { userId };
    
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    } else if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(endDate);
    }

    return this.auditLogRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 1000,
    });
  }

  async findByPatient(
    patientId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AuditLog[]> {
    const where: any = { patientId };
    
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    } else if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(endDate);
    }

    return this.auditLogRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 1000,
    });
  }

  async findByResource(
    resource: AuditResource,
    resourceId?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AuditLog[]> {
    const where: any = { resource };
    
    if (resourceId) {
      where.resourceId = resourceId;
    }
    
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    } else if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(endDate);
    }

    return this.auditLogRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 1000,
    });
  }

  async findFailedLogins(
    startDate?: Date,
    endDate?: Date,
  ): Promise<AuditLog[]> {
    const where: any = {
      action: AuditAction.LOGIN_FAILED,
    };
    
    if (startDate && endDate) {
      where.createdAt = Between(startDate, endDate);
    } else if (startDate) {
      where.createdAt = MoreThanOrEqual(startDate);
    } else if (endDate) {
      where.createdAt = LessThanOrEqual(endDate);
    }

    return this.auditLogRepository.find({
      where,
      order: { createdAt: 'DESC' },
      take: 1000,
    });
  }

  // Remove sensitive fields before logging
  private sanitizeSensitiveData(
    data?: Record<string, any>,
  ): Record<string, any> | undefined {
    if (!data) return undefined;

    const sensitiveFields = [
      'password',
      'refreshToken',
      'verificationToken',
      'resetToken',
      'ssn',
      'socialSecurityNumber',
      'creditCard',
      'cardNumber',
      'cvv',
      'pin',
    ];

    const sanitized = { ...data };
    
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}
