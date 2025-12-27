import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';

export enum CaregiverType {
  FAMILY = 'family',
  PROFESSIONAL = 'professional',
  FRIEND = 'friend',
  VOLUNTEER = 'volunteer',
}

export enum RelationshipType {
  SPOUSE = 'spouse',
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  GRANDPARENT = 'grandparent',
  GRANDCHILD = 'grandchild',
  FRIEND = 'friend',
  PROFESSIONAL = 'professional',
  OTHER = 'other',
}

@Entity('caregivers')
export class Caregiver extends BaseEntity {
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: CaregiverType,
    default: CaregiverType.FAMILY,
  })
  caregiverType: CaregiverType;

  @Column({
    type: 'enum',
    enum: RelationshipType,
    nullable: true,
  })
  relationshipType?: RelationshipType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  organization?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  licenseNumber?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  certification?: string;

  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  @Column({ type: 'text', nullable: true })
  specializations?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'boolean', default: true })
  availableForNewPatients: boolean;

  @Column({ type: 'jsonb', nullable: true })
  availability?: {
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
    maxPatients?: number;
    preferredCommunication?: 'email' | 'sms' | 'phone' | 'app';
    notificationSettings?: {
      taskReminders?: boolean;
      appointmentReminders?: boolean;
      medicationAlerts?: boolean;
      emergencyAlerts?: boolean;
    };
  };
}
