import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Caregiver } from './entities/caregiver.entity';
import {
  CreateCaregiverDto,
  UpdateCaregiverDto,
  QueryCaregiverDto,
} from './dto';

@Injectable()
export class CaregiversService {
  constructor(
    @InjectRepository(Caregiver)
    private readonly caregiverRepository: Repository<Caregiver>,
  ) {}

  async create(createCaregiverDto: CreateCaregiverDto): Promise<Caregiver> {
    const existingCaregiver = await this.caregiverRepository.findOne({
      where: { userId: createCaregiverDto.userId },
    });

    if (existingCaregiver) {
      throw new ConflictException('Caregiver profile already exists for this user');
    }

    const caregiver = this.caregiverRepository.create(createCaregiverDto);
    return await this.caregiverRepository.save(caregiver);
  }

  async findAll(queryDto: QueryCaregiverDto): Promise<{
    data: Caregiver[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      search,
      caregiverType,
      relationshipType,
      availableForNewPatients,
      organization,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const where: FindOptionsWhere<Caregiver> = {};

    if (caregiverType) {
      where.caregiverType = caregiverType;
    }

    if (relationshipType) {
      where.relationshipType = relationshipType;
    }

    if (availableForNewPatients !== undefined) {
      where.availableForNewPatients = availableForNewPatients;
    }

    if (organization) {
      where.organization = Like(`%${organization}%`);
    }

    let queryBuilder = this.caregiverRepository
      .createQueryBuilder('caregiver')
      .leftJoinAndSelect('caregiver.user', 'user');

    Object.keys(where).forEach((key) => {
      queryBuilder = queryBuilder.andWhere(`caregiver.${key} = :${key}`, {
        [key]: where[key as keyof FindOptionsWhere<Caregiver>],
      });
    });

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR caregiver.organization LIKE :search OR caregiver.specializations LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`caregiver.${sortBy}`, sortOrder)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Caregiver> {
    const caregiver = await this.caregiverRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!caregiver) {
      throw new NotFoundException(`Caregiver with ID ${id} not found`);
    }

    return caregiver;
  }

  async findByUserId(userId: string): Promise<Caregiver> {
    const caregiver = await this.caregiverRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!caregiver) {
      throw new NotFoundException(`Caregiver profile not found for user ${userId}`);
    }

    return caregiver;
  }

  async update(id: string, updateCaregiverDto: UpdateCaregiverDto): Promise<Caregiver> {
    const caregiver = await this.findOne(id);
    Object.assign(caregiver, updateCaregiverDto);
    return await this.caregiverRepository.save(caregiver);
  }

  async remove(id: string): Promise<void> {
    const caregiver = await this.findOne(id);
    await this.caregiverRepository.remove(caregiver);
  }

  async search(searchTerm: string): Promise<Caregiver[]> {
    return await this.caregiverRepository
      .createQueryBuilder('caregiver')
      .leftJoinAndSelect('caregiver.user', 'user')
      .where('user.firstName LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('user.lastName LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('caregiver.organization LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('caregiver.specializations LIKE :search', { search: `%${searchTerm}%` })
      .getMany();
  }
}
