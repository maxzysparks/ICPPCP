import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsString()
  @IsOptional()
  outcome?: string;

  @IsString()
  @IsOptional()
  cancellationReason?: string;

  @IsDateString()
  @IsOptional()
  confirmedAt?: string;

  @IsDateString()
  @IsOptional()
  completedAt?: string;

  @IsDateString()
  @IsOptional()
  cancelledAt?: string;

  @IsString()
  @IsOptional()
  updatedBy?: string;
}
