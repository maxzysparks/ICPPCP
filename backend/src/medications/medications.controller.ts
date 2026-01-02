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
import { MedicationsService } from './medications.service';
import {
  CreateMedicationDto,
  UpdateMedicationDto,
  QueryMedicationDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('medications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicationsController {
  constructor(private readonly medicationsService: MedicationsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createMedicationDto: CreateMedicationDto) {
    return this.medicationsService.create(createMedicationDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  findAll(@Query() queryDto: QueryMedicationDto) {
    return this.medicationsService.findAll(queryDto);
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  search(@Query('q') searchTerm: string) {
    return this.medicationsService.search(searchTerm);
  }

  @Get('patient/:patientId')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER)
  findByPatient(@Param('patientId') patientId: string) {
    return this.medicationsService.findByPatient(patientId);
  }

  @Get('patient/:patientId/active')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER)
  findActiveByPatient(@Param('patientId') patientId: string) {
    return this.medicationsService.findActiveByPatient(patientId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER)
  findOne(@Param('id') id: string) {
    return this.medicationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  update(
    @Param('id') id: string,
    @Body() updateMedicationDto: UpdateMedicationDto,
  ) {
    return this.medicationsService.update(id, updateMedicationDto);
  }

  @Patch(':id/mark-taken')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER)
  markAsTaken(@Param('id') id: string) {
    return this.medicationsService.markAsTaken(id);
  }

  @Patch(':id/refills')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  updateRefills(
    @Param('id') id: string,
    @Body('refillsRemaining') refillsRemaining: number,
  ) {
    return this.medicationsService.updateRefills(id, refillsRemaining);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.medicationsService.remove(id);
  }
}
