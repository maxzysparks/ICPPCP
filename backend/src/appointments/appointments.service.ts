import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import {
  CreateAppointmentDto,
  UpdateAppointmentDto,
  QueryAppointmentDto,
} from './dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const scheduledDate = new Date(createAppointmentDto.scheduledDate);

    // Validate appointment is not in the past
    if (scheduledDate < new Date()) {
      throw new BadRequestException('Cannot schedule appointment in the past');
    }

    // Check for conflicts if provider is specified
    if (createAppointmentDto.providerId) {
      const hasConflict = await this.checkProviderConflict(
        createAppointmentDto.providerId,
        scheduledDate,
        createAppointmentDto.durationMinutes || 30,
      );

      if (hasConflict) {
        throw new ConflictException(
          'Provider has a conflicting appointment at this time',
        );
      }
    }

    const appointment = this.appointmentRepository.create(createAppointmentDto);
    return await this.appointmentRepository.save(appointment);
  }

  async findAll(queryDto: QueryAppointmentDto): Promise<{
    data: Appointment[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      patientId,
      providerId,
      search,
      status,
      appointmentType,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'scheduledDate',
      sortOrder = 'ASC',
    } = queryDto;

    const where: FindOptionsWhere<Appointment> = {};

    if (patientId) {
      where.patientId = patientId;
    }

    if (providerId) {
      where.providerId = providerId;
    }

    if (status) {
      where.status = status;
    }

    if (appointmentType) {
      where.appointmentType = appointmentType;
    }

    let queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.provider', 'provider');

    // Apply where conditions
    Object.keys(where).forEach((key) => {
      queryBuilder = queryBuilder.andWhere(`appointment.${key} = :${key}`, {
        [key]: where[key as keyof FindOptionsWhere<Appointment>],
      });
    });

    // Apply date range filter
    if (startDate && endDate) {
      queryBuilder = queryBuilder.andWhere(
        'appointment.scheduledDate BETWEEN :startDate AND :endDate',
        { startDate, endDate },
      );
    } else if (startDate) {
      queryBuilder = queryBuilder.andWhere(
        'appointment.scheduledDate >= :startDate',
        { startDate },
      );
    } else if (endDate) {
      queryBuilder = queryBuilder.andWhere(
        'appointment.scheduledDate <= :endDate',
        { endDate },
      );
    }

    // Apply search
    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(appointment.title LIKE :search OR appointment.providerName LIKE :search OR appointment.specialty LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply pagination and sorting
    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`appointment.${sortBy}`, sortOrder)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'provider'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async findByPatient(patientId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { patientId },
      relations: ['patient', 'provider'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findUpcomingByPatient(patientId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: {
        patientId,
        scheduledDate: MoreThanOrEqual(new Date()),
        status: AppointmentStatus.SCHEDULED as any,
      },
      relations: ['patient', 'provider'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async findByProvider(providerId: string): Promise<Appointment[]> {
    return await this.appointmentRepository.find({
      where: { providerId },
      relations: ['patient', 'provider'],
      order: { scheduledDate: 'ASC' },
    });
  }

  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // If rescheduling, check for conflicts
    if (updateAppointmentDto.scheduledDate) {
      const newScheduledDate = new Date(updateAppointmentDto.scheduledDate);

      if (newScheduledDate < new Date()) {
        throw new BadRequestException('Cannot reschedule appointment to the past');
      }

      if (appointment.providerId) {
        const hasConflict = await this.checkProviderConflict(
          appointment.providerId,
          newScheduledDate,
          updateAppointmentDto.durationMinutes || appointment.durationMinutes,
          id,
        );

        if (hasConflict) {
          throw new ConflictException(
            'Provider has a conflicting appointment at this time',
          );
        }
      }
    }

    Object.assign(appointment, updateAppointmentDto);

    return await this.appointmentRepository.save(appointment);
  }

  async confirm(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.CONFIRMED;
    appointment.confirmedAt = new Date();
    return await this.appointmentRepository.save(appointment);
  }

  async cancel(id: string, reason?: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.CANCELLED;
    appointment.cancelledAt = new Date();
    if (reason) {
      appointment.cancellationReason = reason;
    }
    return await this.appointmentRepository.save(appointment);
  }

  async complete(id: string, outcome?: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.COMPLETED;
    appointment.completedAt = new Date();
    if (outcome) {
      appointment.outcome = outcome;
    }
    return await this.appointmentRepository.save(appointment);
  }

  async markNoShow(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    appointment.status = AppointmentStatus.NO_SHOW;
    return await this.appointmentRepository.save(appointment);
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);
  }

  private async checkProviderConflict(
    providerId: string,
    scheduledDate: Date,
    durationMinutes: number,
    excludeAppointmentId?: string,
  ): Promise<boolean> {
    const endTime = new Date(scheduledDate.getTime() + durationMinutes * 60000);

    const queryBuilder = this.appointmentRepository
      .createQueryBuilder('appointment')
      .where('appointment.providerId = :providerId', { providerId })
      .andWhere('appointment.status NOT IN (:...statuses)', {
        statuses: [AppointmentStatus.CANCELLED, AppointmentStatus.NO_SHOW],
      })
      .andWhere(
        '(appointment.scheduledDate < :endTime AND DATE_ADD(appointment.scheduledDate, INTERVAL appointment.durationMinutes MINUTE) > :scheduledDate)',
        { scheduledDate, endTime },
      );

    if (excludeAppointmentId) {
      queryBuilder.andWhere('appointment.id != :excludeAppointmentId', {
        excludeAppointmentId,
      });
    }

    const conflictingAppointments = await queryBuilder.getCount();
    return conflictingAppointments > 0;
  }

  async search(searchTerm: string): Promise<Appointment[]> {
    return await this.appointmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.patient', 'patient')
      .leftJoinAndSelect('appointment.provider', 'provider')
      .where('appointment.title LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('appointment.providerName LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('appointment.specialty LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('appointment.location LIKE :search', { search: `%${searchTerm}%` })
      .getMany();
  }
}
