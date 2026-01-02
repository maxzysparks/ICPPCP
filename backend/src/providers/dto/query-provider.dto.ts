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
  ProviderType,
  ProviderSpecialty,
} from '../entities/provider.entity';

export class QueryProviderDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ProviderType)
  providerType?: ProviderType;

  @IsOptional()
  @IsEnum(ProviderSpecialty)
  specialty?: ProviderSpecialty;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  acceptingNewPatients?: boolean;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  officeState?: string;

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
