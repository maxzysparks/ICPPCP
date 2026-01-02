import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Provider } from './entities/provider.entity';
import {
  CreateProviderDto,
  UpdateProviderDto,
  QueryProviderDto,
} from './dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async create(createProviderDto: CreateProviderDto): Promise<Provider> {
    const existingProvider = await this.providerRepository.findOne({
      where: { userId: createProviderDto.userId },
    });

    if (existingProvider) {
      throw new ConflictException('Provider profile already exists for this user');
    }

    const provider = this.providerRepository.create(createProviderDto);
    return await this.providerRepository.save(provider);
  }

  async findAll(queryDto: QueryProviderDto): Promise<{
    data: Provider[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      search,
      providerType,
      specialty,
      acceptingNewPatients,
      organization,
      officeState,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const where: FindOptionsWhere<Provider> = {};

    if (providerType) {
      where.providerType = providerType;
    }

    if (specialty) {
      where.specialty = specialty;
    }

    if (acceptingNewPatients !== undefined) {
      where.acceptingNewPatients = acceptingNewPatients;
    }

    if (organization) {
      where.organization = Like(`%${organization}%`);
    }

    if (officeState) {
      where.officeState = officeState;
    }

    let queryBuilder = this.providerRepository
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.user', 'user');

    Object.keys(where).forEach((key) => {
      queryBuilder = queryBuilder.andWhere(`provider.${key} = :${key}`, {
        [key]: where[key as keyof FindOptionsWhere<Provider>],
      });
    });

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(user.firstName LIKE :search OR user.lastName LIKE :search OR provider.organization LIKE :search OR provider.credentials LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`provider.${sortBy}`, sortOrder)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<Provider> {
    const provider = await this.providerRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!provider) {
      throw new NotFoundException(`Provider with ID ${id} not found`);
    }

    return provider;
  }

  async findByUserId(userId: string): Promise<Provider> {
    const provider = await this.providerRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    if (!provider) {
      throw new NotFoundException(`Provider profile not found for user ${userId}`);
    }

    return provider;
  }

  async update(id: string, updateProviderDto: UpdateProviderDto): Promise<Provider> {
    const provider = await this.findOne(id);
    Object.assign(provider, updateProviderDto);
    return await this.providerRepository.save(provider);
  }

  async remove(id: string): Promise<void> {
    const provider = await this.findOne(id);
    await this.providerRepository.remove(provider);
  }

  async search(searchTerm: string): Promise<Provider[]> {
    return await this.providerRepository
      .createQueryBuilder('provider')
      .leftJoinAndSelect('provider.user', 'user')
      .where('user.firstName LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('user.lastName LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('provider.organization LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('provider.credentials LIKE :search', { search: `%${searchTerm}%` })
      .orWhere('provider.licenseNumber LIKE :search', { search: `%${searchTerm}%` })
      .getMany();
  }
}
