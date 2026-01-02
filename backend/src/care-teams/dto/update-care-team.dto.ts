import { PartialType } from '@nestjs/mapped-types';
import { CreateCareTeamDto } from './create-care-team.dto';

export class UpdateCareTeamDto extends PartialType(CreateCareTeamDto) {}
