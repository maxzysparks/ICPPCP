import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsInt,
  IsArray,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import {
  MedicationStatus,
  MedicationFrequency,
  MedicationRoute,
} from '../entities/medication.entity';

export class CreateMedicationDto {
  @IsString()
  patientId: string;

  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  genericName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  rxNormCode?: string;

  @IsString()
  @MaxLength(100)
  dosage: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  strength?: string;

  @IsEnum(MedicationRoute)
  @IsOptional()
  route?: MedicationRoute = MedicationRoute.ORAL;

  @IsEnum(MedicationFrequency)
  frequency: MedicationFrequency;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  customFrequency?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  scheduledTimes?: string[];

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsEnum(MedicationStatus)
  @IsOptional()
  status?: MedicationStatus = MedicationStatus.ACTIVE;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  prescribedBy?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  prescriptionNumber?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  refillsRemaining?: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  pharmacy?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  pharmacyPhone?: string;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsString()
  @IsOptional()
  sideEffects?: string;

  @IsString()
  @IsOptional()
  instructions?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  reminderEnabled?: boolean = true;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(120)
  reminderMinutesBefore?: number = 30;

  @IsString()
  @IsOptional()
  addedBy?: string;
}
