import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsObject,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import {
  CaregiverType,
  RelationshipType,
} from '../entities/caregiver.entity';

export class CreateCaregiverDto {
  @IsString()
  userId: string;

  @IsEnum(CaregiverType)
  @IsOptional()
  caregiverType?: CaregiverType = CaregiverType.FAMILY;

  @IsEnum(RelationshipType)
  @IsOptional()
  relationshipType?: RelationshipType;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  organization?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  licenseNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  certification?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  yearsOfExperience?: number = 0;

  @IsString()
  @IsOptional()
  specializations?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsBoolean()
  @IsOptional()
  availableForNewPatients?: boolean = true;

  @IsObject()
  @IsOptional()
  availability?: {
    monday?: { start: string; end: string };
    tuesday?: { start: string; end: string };
    wednesday?: { start: string; end: string };
    thursday?: { start: string; end: string };
    friday?: { start: string; end: string };
    saturday?: { start: string; end: string };
    sunday?: { start: string; end: string };
  };

  @IsObject()
  @IsOptional()
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
