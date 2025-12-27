import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Patient } from '../../patients/entities/patient.entity';

export enum CareTeamStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  ARCHIVED = 'archived',
}

@Entity('care_teams')
export class CareTeam extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Patient)
  @JoinColumn()
  patient: Patient;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({
    type: 'enum',
    enum: CareTeamStatus,
    default: CareTeamStatus.ACTIVE,
  })
  status: CareTeamStatus;

  @Column({ type: 'timestamp', nullable: true })
  startDate?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate?: Date;

  @Column({ type: 'jsonb', nullable: true })
  settings?: {
    allowMemberInvites?: boolean;
    requireApprovalForNewMembers?: boolean;
    allowDocumentSharing?: boolean;
    allowMessaging?: boolean;
    notifyOnNewActivity?: boolean;
  };
}
