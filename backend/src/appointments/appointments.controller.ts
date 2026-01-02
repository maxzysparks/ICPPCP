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
import { AppointmentsService } from './appointments.service';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  QueryAppointmentDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  findAll(@Query() queryDto: QueryAppointmentDto) {
    return this.appointmentsService.findAll(queryDto);
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  search(@Query('q') searchTerm: string) {
    return this.appointmentsService.search(searchTerm);
  }

  @Get('patient/:patientId')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER)
  findByPatient(@Param('patientId') patientId: string) {
    return this.appointmentsService.findByPatient(patientId);
  }

  @Get('patient/:patientId/upcoming')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER)
  findUpcomingByPatient(@Param('patientId') patientId: string) {
    return this.appointmentsService.findUpcomingByPatient(patientId);
  }

  @Get('provider/:providerId')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  findByProvider(@Param('providerId') providerId: string) {
    return this.appointmentsService.findByProvider(providerId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER)
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER)
  update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Patch(':id/confirm')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT)
  confirm(@Param('id') id: string) {
    return this.appointmentsService.confirm(id);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.PATIENT, UserRole.CAREGIVER)
  cancel(
    @Param('id') id: string,
    @Body('reason') reason?: string,
  ) {
    return this.appointmentsService.cancel(id, reason);
  }

  @Patch(':id/complete')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  complete(
    @Param('id') id: string,
    @Body('outcome') outcome?: string,
  ) {
    return this.appointmentsService.complete(id, outcome);
  }

  @Patch(':id/no-show')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  markNoShow(@Param('id') id: string) {
    return this.appointmentsService.markNoShow(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
