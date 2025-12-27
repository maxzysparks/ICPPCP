import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Patient } from '../../patients/entities/patient.entity';
import { Provider } from '../../providers/entities/provider.entity';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum AppointmentType {
  IN_PERSON = 'in_person',
  TELEHEALTH = 'telehealth',
  PHONE = 'phone',
  HOME_VISIT = 'home_visit',
}

@Entity('appointments')
export class Appointment extends BaseEntity {
  @ManyToOne(() => Patient)
  @JoinColumn()
  patient: Patient;

  @Column({ type: 'uuid' })
  patientId: string;

  @ManyToOne(() => Provider, { nullable: true })
  @JoinColumn()
  provider?: Provider;

  @Column({ type: 'uuid', nullable: true })
  providerId?: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  scheduledDate: Date;

  @Column({ type: 'int', default: 30 })
  durationMinutes: number;

  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.IN_PERSON,
  })
  appointmentType: AppointmentType;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  state?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  virtualMeetingLink?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  providerName?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  specialty?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contactPhone?: string;

  @Column({ type: 'text', nullable: true })
  purpose?: string;

  @Column({ type: 'text', nullable: true })
  preparation?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  outcome?: string;

  @Column({ type: 'boolean', default: true })
  reminderEnabled: boolean;

  @Column({ type: 'int', default: 1440 })
  reminderMinutesBefore: number;

  @Column({ type: 'timestamp', nullable: true })
  reminderSentAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  cancellationReason?: string;

  @Column({ type: 'uuid', nullable: true })
  createdBy?: string;

  @Column({ type: 'uuid', nullable: true })
  updatedBy?: string;
}
