import {
  IsOptional,
  IsString,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsBoolean,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  CaregiverType,
  RelationshipType,
} from '../entities/caregiver.entity';

export class QueryCaregiverDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CaregiverType)
  caregiverType?: CaregiverType;

  @IsOptional()
  @IsEnum(RelationshipType)
  relationshipType?: RelationshipType;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  availableForNewPatients?: boolean;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
