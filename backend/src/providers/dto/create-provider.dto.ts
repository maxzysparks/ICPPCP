import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsBoolean,
  IsObject,
  IsArray,
  IsDateString,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import {
  ProviderType,
  ProviderSpecialty,
} from '../entities/provider.entity';

export class CreateProviderDto {
  @IsString()
  userId: string;

  @IsEnum(ProviderType)
  providerType: ProviderType;

  @IsEnum(ProviderSpecialty)
  @IsOptional()
  specialty?: ProviderSpecialty;

  @IsString()
  @MaxLength(100)
  licenseNumber: string;

  @IsString()
  @MaxLength(50)
  licenseState: string;

  @IsDateString()
  @IsOptional()
  licenseExpiration?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  npiNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  deaNumber?: string;

  @IsString()
  @MaxLength(255)
  organization: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  department?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  officeAddress?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  officeCity?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  officeState?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  officeZipCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  officePhone?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  officeFax?: string;

  @IsString()
  @IsOptional()
  credentials?: string;

  @IsInt()
  @IsOptional()
  @Min(0)
  @Max(100)
  yearsOfExperience?: number = 0;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsBoolean()
  @IsOptional()
  acceptingNewPatients?: boolean = true;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  languagesSpoken?: string[];

  @IsObject()
  @IsOptional()
  officeHours?: {
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
    preferredCommunication?: 'email' | 'phone' | 'fax' | 'ehr';
    notificationSettings?: {
      newPatientAlerts?: boolean;
      appointmentReminders?: boolean;
      criticalAlerts?: boolean;
      careTeamUpdates?: boolean;
    };
  };
}
