import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  EXPORT = 'EXPORT',
  PRINT = 'PRINT',
}

export enum AuditResource {
  USER = 'USER',
  PATIENT = 'PATIENT',
  MEDICATION = 'MEDICATION',
  APPOINTMENT = 'APPOINTMENT',
  PROVIDER = 'PROVIDER',
  CAREGIVER = 'CAREGIVER',
  CARE_TEAM = 'CARE_TEAM',
  AUTH = 'AUTH',
}

@Entity('audit_logs')
@Index(['userId', 'createdAt'])
@Index(['resource', 'action', 'createdAt'])
@Index(['patientId', 'createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  userId: string;

  @Column({ nullable: true })
  userEmail: string;

  @Column({ nullable: true })
  userRole: string;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditResource,
  })
  resource: AuditResource;

  @Column({ type: 'uuid', nullable: true })
  @Index()
  resourceId: string;

  @Column({ type: 'uuid', nullable: true })
  patientId: string; // For HIPAA - track all patient data access

  @Column({ type: 'jsonb', nullable: true })
  previousData: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  newData: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  requestMethod: string;

  @Column({ nullable: true })
  requestUrl: string;

  @Column({ default: true })
  success: boolean;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  @Index()
  createdAt: Date;
}
