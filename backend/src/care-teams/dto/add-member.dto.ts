import {
  IsString,
  IsOptional,
  IsEnum,
  IsObject,
  IsDateString,
} from 'class-validator';
import {
  MemberRole,
  MemberStatus,
  PermissionLevel,
} from '../entities/care-team-member.entity';

export class AddMemberDto {
  @IsString()
  careTeamId: string;

  @IsString()
  userId: string;

  @IsEnum(MemberRole)
  role: MemberRole;

  @IsEnum(MemberStatus)
  @IsOptional()
  status?: MemberStatus = MemberStatus.INVITED;

  @IsEnum(PermissionLevel)
  @IsOptional()
  permissionLevel?: PermissionLevel = PermissionLevel.VIEW_ONLY;

  @IsDateString()
  @IsOptional()
  invitedAt?: string;

  @IsString()
  @IsOptional()
  invitedBy?: string;

  @IsObject()
  @IsOptional()
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

  @IsString()
  @IsOptional()
  notes?: string;
}
