import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PatientsModule } from './patients/patients.module';
import { MedicationsModule } from './medications/medications.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { CaregiversModule } from './caregivers/caregivers.module';
import { ProvidersModule } from './providers/providers.module';
import { CareTeamsModule } from './care-teams/care-teams.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    // Rate Limiting - Prevent brute force attacks
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 1 second
        limit: 3, // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20, // 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 5432,
        username: configService.get('DB_USER') || 'icppcp_user',
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME') || 'icppcp_dev',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production', // Disable in production
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        migrationsRun: false,
        logging: configService.get('DB_LOGGING') === 'true',
        ssl: { rejectUnauthorized: false }, // Required for Supabase
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    PatientsModule,
    MedicationsModule,
    AppointmentsModule,
    CaregiversModule,
    ProvidersModule,
    CareTeamsModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Apply rate limiting globally
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
