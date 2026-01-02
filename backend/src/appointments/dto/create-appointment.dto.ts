import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsInt,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import {
  AppointmentStatus,
  AppointmentType,
} from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @IsString()
  patientId: string;

  @IsString()
  @IsOptional()
  providerId?: string;

  @IsString()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  scheduledDate: string;

  @IsInt()
  @IsOptional()
  @Min(5)
  @Max(480)
  durationMinutes?: number = 30;

  @IsEnum(AppointmentType)
  @IsOptional()
  appointmentType?: AppointmentType = AppointmentType.IN_PERSON;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus = AppointmentStatus.SCHEDULED;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  location?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  address?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  state?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  zipCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  virtualMeetingLink?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  providerName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  specialty?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  contactPhone?: string;

  @IsString()
  @IsOptional()
  purpose?: string;

  @IsString()
  @IsOptional()
  preparation?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  reminderEnabled?: boolean = true;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(10080)
  reminderMinutesBefore?: number = 1440;

  @IsString()
  @IsOptional()
  createdBy?: string;
}
