import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Patient } from '../../patients/entities/patient.entity';

export enum MedicationStatus {
  ACTIVE = 'active',
  DISCONTINUED = 'discontinued',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
}

export enum MedicationFrequency {
  ONCE_DAILY = 'once_daily',
  TWICE_DAILY = 'twice_daily',
  THREE_TIMES_DAILY = 'three_times_daily',
  FOUR_TIMES_DAILY = 'four_times_daily',
  EVERY_OTHER_DAY = 'every_other_day',
  WEEKLY = 'weekly',
  AS_NEEDED = 'as_needed',
  CUSTOM = 'custom',
}

export enum MedicationRoute {
  ORAL = 'oral',
  TOPICAL = 'topical',
  INJECTION = 'injection',
  INHALATION = 'inhalation',
  RECTAL = 'rectal',
  OPHTHALMIC = 'ophthalmic',
  OTIC = 'otic',
  NASAL = 'nasal',
  OTHER = 'other',
}

@Entity('medications')
export class Medication extends BaseEntity {
  @ManyToOne(() => Patient)
  @JoinColumn()
  patient: Patient;

  @Column({ type: 'uuid' })
  patientId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  genericName?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  rxNormCode?: string;

  @Column({ type: 'varchar', length: 100 })
  dosage: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  strength?: string;

  @Column({
    type: 'enum',
    enum: MedicationRoute,
    default: MedicationRoute.ORAL,
  })
  route: MedicationRoute;

  @Column({
    type: 'enum',
    enum: MedicationFrequency,
  })
  frequency: MedicationFrequency;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customFrequency?: string;

  @Column({ type: 'simple-array', nullable: true })
  scheduledTimes?: string[];

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({
    type: 'enum',
    enum: MedicationStatus,
    default: MedicationStatus.ACTIVE,
  })
  status: MedicationStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  prescribedBy?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  prescriptionNumber?: string;

  @Column({ type: 'int', nullable: true })
  refillsRemaining?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  pharmacy?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  pharmacyPhone?: string;

  @Column({ type: 'text', nullable: true })
  purpose?: string;

  @Column({ type: 'text', nullable: true })
  sideEffects?: string;

  @Column({ type: 'text', nullable: true })
  instructions?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: true })
  reminderEnabled: boolean;

  @Column({ type: 'int', default: 30 })
  reminderMinutesBefore: number;

  @Column({ type: 'uuid', nullable: true })
  addedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  lastTakenAt?: Date;
}
