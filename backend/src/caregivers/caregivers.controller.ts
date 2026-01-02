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
import { CaregiversService } from './caregivers.service';
import {
  CreateCaregiverDto,
  UpdateCaregiverDto,
  QueryCaregiverDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('caregivers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CaregiversController {
  constructor(private readonly caregiversService: CaregiversService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.CAREGIVER)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCaregiverDto: CreateCaregiverDto) {
    return this.caregiversService.create(createCaregiverDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  findAll(@Query() queryDto: QueryCaregiverDto) {
    return this.caregiversService.findAll(queryDto);
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  search(@Query('q') searchTerm: string) {
    return this.caregiversService.search(searchTerm);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  findByUserId(@Param('userId') userId: string) {
    return this.caregiversService.findByUserId(userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER)
  findOne(@Param('id') id: string) {
    return this.caregiversService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.CAREGIVER)
  update(@Param('id') id: string, @Body() updateCaregiverDto: UpdateCaregiverDto) {
    return this.caregiversService.update(id, updateCaregiverDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.caregiversService.remove(id);
  }
}
