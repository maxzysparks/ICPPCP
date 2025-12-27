import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

@Entity('patients')
export class Patient extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  medicalRecordNumber?: string;

  @Column({ type: 'enum', enum: BloodType, nullable: true })
  bloodType?: BloodType;

  @Column({ type: 'varchar', length: 20, nullable: true })
  height?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  weight?: string;

  @Column({ type: 'text', nullable: true })
  allergies?: string;

  @Column({ type: 'text', nullable: true })
  chronicConditions?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  primaryPhysician?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  primaryPhysicianPhone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergencyContactName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  emergencyContactRelationship?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  emergencyContactPhone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  insuranceProvider?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insurancePolicyNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  insuranceGroupNumber?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'jsonb', nullable: true })
  preferences?: {
    communicationMethod?: 'email' | 'sms' | 'phone';
    reminderFrequency?: 'daily' | 'weekly' | 'asNeeded';
    shareDataWithCaregivers?: boolean;
    shareDataWithProviders?: boolean;
  };
}
