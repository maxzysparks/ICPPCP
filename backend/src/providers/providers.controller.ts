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
import { ProvidersService } from './providers.service';
import {
  CreateProviderDto,
  UpdateProviderDto,
  QueryProviderDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('providers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.create(createProviderDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER, UserRole.PATIENT)
  findAll(@Query() queryDto: QueryProviderDto) {
    return this.providersService.findAll(queryDto);
  }

  @Get('search')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER, UserRole.PATIENT)
  search(@Query('q') searchTerm: string) {
    return this.providersService.search(searchTerm);
  }

  @Get('user/:userId')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  findByUserId(@Param('userId') userId: string) {
    return this.providersService.findByUserId(userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CAREGIVER, UserRole.PATIENT)
  findOne(@Param('id') id: string) {
    return this.providersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.PROVIDER)
  update(@Param('id') id: string, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providersService.update(id, updateProviderDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.providersService.remove(id);
  }
}
