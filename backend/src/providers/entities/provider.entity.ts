import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum ProviderType {
  PHYSICIAN = 'physician',
  NURSE = 'nurse',
  NURSE_PRACTITIONER = 'nurse_practitioner',
  PHYSICIAN_ASSISTANT = 'physician_assistant',
  THERAPIST = 'therapist',
  PHARMACIST = 'pharmacist',
  SOCIAL_WORKER = 'social_worker',
  CASE_MANAGER = 'case_manager',
  OTHER = 'other',
}

export enum ProviderSpecialty {
  PRIMARY_CARE = 'primary_care',
  CARDIOLOGY = 'cardiology',
  ONCOLOGY = 'oncology',
  NEUROLOGY = 'neurology',
  ENDOCRINOLOGY = 'endocrinology',
  GERIATRICS = 'geriatrics',
  PSYCHIATRY = 'psychiatry',
  PHYSICAL_THERAPY = 'physical_therapy',
  OCCUPATIONAL_THERAPY = 'occupational_therapy',
  HOME_HEALTH = 'home_health',
  PALLIATIVE_CARE = 'palliative_care',
  OTHER = 'other',
}

@Entity('providers')
export class Provider extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ProviderType,
  })
  providerType: ProviderType;

  @Column({
    type: 'enum',
    enum: ProviderSpecialty,
    nullable: true,
  })
  specialty?: ProviderSpecialty;

  @Column({ type: 'varchar', length: 100 })
  licenseNumber: string;

  @Column({ type: 'varchar', length: 50 })
  licenseState: string;

  @Column({ type: 'date', nullable: true })
  licenseExpiration?: Date;

  @Column({ type: 'varchar', length: 100, nullable: true })
  npiNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  deaNumber?: string;

  @Column({ type: 'varchar', length: 255 })
  organization: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  department?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  officeAddress?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  officeCity?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  officeState?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  officeZipCode?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  officePhone?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  officeFax?: string;

  @Column({ type: 'text', nullable: true })
  credentials?: string;

  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'boolean', default: true })
  acceptingNewPatients: boolean;

  @Column({ type: 'simple-array', nullable: true })
  languagesSpoken?: string[];

  @Column({ type: 'jsonb', nullable: true })
  officeHours?: {
    monday?: { start: string; end: string };
    tuesday?: { start: string; end: string };
    wednesday?: { start: string; end: string };
    thursday?: { start: string; end: string };
    friday?: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    preferredCommunication?: 'email' | 'phone' | 'fax' | 'ehr';
    notificationSettings?: {
      newPatientAlerts?: boolean;
      appointmentReminders?: boolean;
      criticalAlerts?: boolean;
      careTeamUpdates?: boolean;
    };
  };
}
