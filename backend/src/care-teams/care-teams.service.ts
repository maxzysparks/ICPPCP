import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CareTeam } from './entities/care-team.entity';
import { CareTeamMember } from './entities/care-team-member.entity';
import {
  CreateCareTeamDto,
  UpdateCareTeamDto,
  QueryCareTeamDto,
  AddMemberDto,
  UpdateMemberDto,
} from './dto';

@Injectable()
export class CareTeamsService {
  constructor(
    @InjectRepository(CareTeam)
    private readonly careTeamRepository: Repository<CareTeam>,
    @InjectRepository(CareTeamMember)
    private readonly memberRepository: Repository<CareTeamMember>,
  ) {}

  // CareTeam operations
  async create(createDto: CreateCareTeamDto): Promise<CareTeam> {
    const careTeam = this.careTeamRepository.create(createDto);
    return await this.careTeamRepository.save(careTeam);
  }

  async findAll(queryDto: QueryCareTeamDto): Promise<{
    data: CareTeam[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      patientId,
      search,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const where: FindOptionsWhere<CareTeam> = {};
    if (patientId) where.patientId = patientId;
    if (status) where.status = status;

    let queryBuilder = this.careTeamRepository
      .createQueryBuilder('careTeam')
      .leftJoinAndSelect('careTeam.patient', 'patient');

    Object.keys(where).forEach((key) => {
      queryBuilder = queryBuilder.andWhere(`careTeam.${key} = :${key}`, {
        [key]: where[key as keyof FindOptionsWhere<CareTeam>],
      });
    });

    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(careTeam.name LIKE :search OR careTeam.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy(`careTeam.${sortBy}`, sortOrder)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<CareTeam> {
    const careTeam = await this.careTeamRepository.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!careTeam) {
      throw new NotFoundException(`Care team with ID ${id} not found`);
    }
    return careTeam;
  }

  async update(id: string, updateDto: UpdateCareTeamDto): Promise<CareTeam> {
    const careTeam = await this.findOne(id);
    Object.assign(careTeam, updateDto);
    return await this.careTeamRepository.save(careTeam);
  }

  async remove(id: string): Promise<void> {
    const careTeam = await this.findOne(id);
    await this.careTeamRepository.remove(careTeam);
  }

  // Member operations
  async addMember(addMemberDto: AddMemberDto): Promise<CareTeamMember> {
    const existing = await this.memberRepository.findOne({
      where: {
        careTeamId: addMemberDto.careTeamId,
        userId: addMemberDto.userId,
      },
    });

    if (existing) {
      throw new ConflictException('User is already a member of this care team');
    }

    const member = this.memberRepository.create(addMemberDto);
    return await this.memberRepository.save(member);
  }

  async getMembers(careTeamId: string): Promise<CareTeamMember[]> {
    return await this.memberRepository.find({
      where: { careTeamId },
      relations: ['user', 'careTeam'],
      order: { createdAt: 'ASC' },
    });
  }

  async updateMember(id: string, updateDto: UpdateMemberDto): Promise<CareTeamMember> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    Object.assign(member, updateDto);
    return await this.memberRepository.save(member);
  }

  async removeMember(id: string): Promise<void> {
    const member = await this.memberRepository.findOne({ where: { id } });
    if (!member) {
      throw new NotFoundException(`Member with ID ${id} not found`);
    }
    await this.memberRepository.remove(member);
  }
}
