import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Medication } from './entities/medication.entity';
import {
  CreateMedicationDto,
  UpdateMedicationDto,
  QueryMedicationDto,
} from './dto';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private readonly medicationRepository: Repository<Medication>,
  ) {}

  async create(createMedicationDto: CreateMedicationDto): Promise<Medication> {
    // Validate dates
    if (createMedicationDto.endDate) {
      const startDate = new Date(createMedicationDto.startDate);
      const endDate = new Date(createMedicationDto.endDate);
      
      if (endDate < startDate) {
        throw new BadRequestException('End date cannot be before start date');
      }
    }

    const medication = this.medicationRepository.create(createMedicationDto);
    return await this.medicationRepository.save(medication);
  }

  async findAll(queryDto: QueryMedicationDto): Promise<{
    data: Medication[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      patientId,
      search,
      status,
      frequency,
      route,
      reminderEnabled,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const where: FindOptionsWhere<Medication> = {};

    if (patientId) {
      where.patientId = patientId;
    }

    if (status) {
      where.status = status;
    }

    if (frequency) {
      where.frequency = frequency;
    }

    if (route) {
      where.route = route;
    }

    if (reminderEnabled !== undefined) {
      where.reminderEnabled = reminderEnabled;
    }

    let queryBuilder = this.medicationRepository
      .createQueryBuilder('medication')
      .leftJoinAndSelect('medication.patient', 'patient');

    // Apply where conditions
    Object.keys(where).forEach((key) => {
      queryBuilder = queryBuilder.andWhere(`medication.${key} = :${key}`, {
        [key]: where[key as keyof FindOptionsWhere<Medication>],
      });
    });

    // Apply search
    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(medication.name LIKE :search OR medication.genericName LIKE :search OR medication.prescribedBy LIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply pagination and sorting
    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`medication.${sortBy}`, sortOrder)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Medication> {
    const medication = await this.medicationRepository.findOne({
      where: { id },
      relations: ['patient'],
    });

    if (!medication) {
      throw new NotFoundException(`Medication with ID ${id} not found`);
    }

    return medication;
  }

  async findByPatient(patientId: string): Promise<Medication[]> {
    return await this.medicationRepository.find({
      where: { patientId },
      relations: ['patient'],
      order: { createdAt: 'DESC' },
    });
  }

  async findActiveByPatient(patientId: string): Promise<Medication[]> {
    return await this.medicationRepository.find({
      where: { 
        patientId,
        status: 'active' as any,
      },
      relations: ['patient'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(
    id: string,
    updateMedicationDto: UpdateMedicationDto,
  ): Promise<Medication> {
    const medication = await this.findOne(id);

    // Validate dates if both are provided
    if (updateMedicationDto.startDate && updateMedicationDto.endDate) {
      const startDate = new Date(updateMedicationDto.startDate);
      const endDate = new Date(updateMedicationDto.endDate);
      
      if (endDate < startDate) {
        throw new BadRequestException('End date cannot be before start date');
      }
    }

    Object.assign(medication, updateMedicationDto);

    return await this.medicationRepository.save(medication);
  }

  async remove(id: string): Promise<void> {
    const medication = await this.findOne(id);
    await this.medicationRepository.remove(medication);
  }

  async markAsTaken(id: string): Promise<Medication> {
    const medication = await this.findOne(id);
    medication.lastTakenAt = new Date();
    return await this.medicationRepository.save(medication);
  }

  async updateRefills(id: string, refillsRemaining: number): Promise<Medication> {
    const medication = await this.findOne(id);
    
    if (refillsRemaining < 0) {
      throw new BadRequestException('Refills remaining cannot be negative');
    }

    medication.refillsRemaining = refillsRemaining;
    return await this.medicationRepository.save(medication);
  }

  async search(searchTerm: string): Promise<Medication[]> {
    return await this.medicationRepository
      .createQueryBuilder('medication')
      .leftJoinAndSelect('medication.patient', 'patient')
      .where('medication.name LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('medication.genericName LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('medication.prescribedBy LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('medication.prescriptionNumber LIKE :search', { search: `%${searchTerm}%` })
      .getMany();
  }
}
