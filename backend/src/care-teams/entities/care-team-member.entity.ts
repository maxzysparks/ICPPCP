import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { CareTeam } from './care-team.entity';
import { User } from '../../users/entities/user.entity';

export enum MemberRole {
  PRIMARY_CAREGIVER = 'primary_caregiver',
  SECONDARY_CAREGIVER = 'secondary_caregiver',
  FAMILY_MEMBER = 'family_member',
  HEALTHCARE_PROVIDER = 'healthcare_provider',
  CASE_MANAGER = 'case_manager',
  OBSERVER = 'observer',
}

export enum MemberStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  INACTIVE = 'inactive',
  REMOVED = 'removed',
}

export enum PermissionLevel {
  FULL_ACCESS = 'full_access',
  EDIT = 'edit',
  VIEW_ONLY = 'view_only',
}

@Entity('care_team_members')
export class CareTeamMember extends BaseEntity {
  @ManyToOne(() => CareTeam)
  @JoinColumn()
  careTeam: CareTeam;

  @Column({ type: 'uuid' })
  careTeamId: string;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: MemberRole,
  })
  role: MemberRole;

  @Column({
    type: 'enum',
    enum: MemberStatus,
    default: MemberStatus.INVITED,
  })
  status: MemberStatus;

  @Column({
    type: 'enum',
    enum: PermissionLevel,
    default: PermissionLevel.VIEW_ONLY,
  })
  permissionLevel: PermissionLevel;

  @Column({ type: 'timestamp', nullable: true })
  joinedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  invitedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  invitedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastAccessedAt?: Date;

  @Column({ type: 'jsonb', nullable: true })
  permissions?: {
    canViewCarePlan?: boolean;
    canEditCarePlan?: boolean;
    canViewMedications?: boolean;
    canEditMedications?: boolean;
    canViewAppointments?: boolean;
    canEditAppointments?: boolean;
    canViewDocuments?: boolean;
    canUploadDocuments?: boolean;
    canSendMessages?: boolean;
    canInviteMembers?: boolean;
    canRemoveMembers?: boolean;
  };

  @Column({ type: 'text', nullable: true })
  notes?: string;
}
