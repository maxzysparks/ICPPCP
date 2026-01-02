import { PartialType } from '@nestjs/mapped-types';
import { AddMemberDto } from './add-member.dto';
import { IsDateString, IsOptional } from 'class-validator';

export class UpdateMemberDto extends PartialType(AddMemberDto) {
  @IsDateString()
  @IsOptional()
  joinedAt?: string;

  @IsDateString()
  @IsOptional()
  lastAccessedAt?: string;
}
