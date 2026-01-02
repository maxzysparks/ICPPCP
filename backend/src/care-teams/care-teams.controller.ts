import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CareTeamsService } from './care-teams.service';
import {
  CreateCareTeamDto,
  UpdateCareTeamDto,
  QueryCareTeamDto,
  AddMemberDto,
  UpdateMemberDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('care-teams')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CareTeamsController {
  constructor(private readonly careTeamsService: CareTeamsService) {}

  // Care Team endpoints
  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateCareTeamDto) {
    return this.careTeamsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER, UserRole.PATIENT)
  findAll(@Query() queryDto: QueryCareTeamDto) {
    return this.careTeamsService.findAll(queryDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER, UserRole.PATIENT)
  findOne(@Param('id') id: string) {
    return this.careTeamsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  update(@Param('id') id: string, @Body() updateDto: UpdateCareTeamDto) {
    return this.careTeamsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.careTeamsService.remove(id);
  }

  // Member endpoints
  @Post('members')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  @HttpCode(HttpStatus.CREATED)
  addMember(@Body() addMemberDto: AddMemberDto) {
    return this.careTeamsService.addMember(addMemberDto);
  }

  @Get(':careTeamId/members')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER, UserRole.PATIENT)
  getMembers(@Param('careTeamId') careTeamId: string) {
    return this.careTeamsService.getMembers(careTeamId);
  }

  @Patch('members/:id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  updateMember(@Param('id') id: string, @Body() updateDto: UpdateMemberDto) {
    return this.careTeamsService.updateMember(id, updateDto);
  }

  @Delete('members/:id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(@Param('id') id: string) {
    return this.careTeamsService.removeMember(id);
  }
}
