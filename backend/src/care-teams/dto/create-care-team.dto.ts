import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsObject,
  MaxLength,
} from 'class-validator';
import { CareTeamStatus } from '../entities/care-team.entity';

export class CreateCareTeamDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  patientId: string;

  @IsEnum(CareTeamStatus)
  @IsOptional()
  status?: CareTeamStatus = CareTeamStatus.ACTIVE;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsObject()
  @IsOptional()
  settings?: {
    allowMemberInvites?: boolean;
    requireApprovalForNewMembers?: boolean;
    allowDocumentSharing?: boolean;
    allowMessaging?: boolean;
    notifyOnNewActivity?: boolean;
  };
}
