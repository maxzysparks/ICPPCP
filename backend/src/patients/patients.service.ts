import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Patient } from './entities/patient.entity';
import {
  CreatePatientDto,
  UpdatePatientDto,
  QueryPatientDto,
} from './dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    // Check if patient already exists for this user
    const existingPatient = await this.patientRepository.findOne({
      where: { userId: createPatientDto.userId },
    });

    if (existingPatient) {
      throw new ConflictException('Patient profile already exists for this user');
    }

    const patient = this.patientRepository.create(createPatientDto);
    return await this.patientRepository.save(patient);
  }

  async findAll(queryDto: QueryPatientDto): Promise<{
    data: Patient[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      search,
      bloodType,
      insuranceProvider,
      primaryPhysician,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const where: FindOptionsWhere<Patient> = {};

    if (bloodType) {
      where.bloodType = bloodType;
    }

    if (insuranceProvider) {
      where.insuranceProvider = Like(`%${insuranceProvider}%`);
    }

    if (primaryPhysician) {
      where.primaryPhysician = Like(`%${primaryPhysician}%`);
    }

    const [data, total] = await this.patientRepository.findAndCount({
      where,
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortOrder },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  async findByUserId(userId: string): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!patient) {
      throw new NotFoundException(`Patient profile not found for user ${userId}`);
    }

    return patient;
  }

  async update(id: string, updatePatientDto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id);

    Object.assign(patient, updatePatientDto);

    return await this.patientRepository.save(patient);
  }

  async remove(id: string): Promise<void> {
    const patient = await this.findOne(id);
    await this.patientRepository.remove(patient);
  }

  async search(searchTerm: string): Promise<Patient[]> {
    return await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.user', 'user')
      .where('user.firstName LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('user.lastName LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('user.email LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('patient.medicalRecordNumber LIKE :search', {
        search: `%${searchTerm}%`,
      })
      .getMany();
  }
}
