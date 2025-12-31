import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MaxLength,
  IsObject,
} from 'class-validator';
import { BloodType } from '../entities/patient.entity';

export class CreatePatientDto {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  medicalRecordNumber?: string;

  @IsEnum(BloodType)
  @IsOptional()
  bloodType?: BloodType;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  height?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  weight?: string;

  @IsString()
  @IsOptional()
  allergies?: string;

  @IsString()
  @IsOptional()
  chronicConditions?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  primaryPhysician?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  primaryPhysicianPhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  emergencyContactName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  emergencyContactRelationship?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  emergencyContactPhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  insuranceProvider?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  insurancePolicyNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  insuranceGroupNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsObject()
  @IsOptional()
  preferences?: {
    communicationMethod?: 'email' | 'sms' | 'phone';
    reminderFrequency?: 'daily' | 'weekly' | 'asNeeded';
    shareDataWithCaregivers?: boolean;
    shareDataWithProviders?: boolean;
  };
}
