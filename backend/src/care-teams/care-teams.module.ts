import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareTeamsService } from './care-teams.service';
import { CareTeamsController } from './care-teams.controller';
import { CareTeam } from './entities/care-team.entity';
import { CareTeamMember } from './entities/care-team-member.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CareTeam, CareTeamMember]),
    AuthModule,
  ],
  controllers: [CareTeamsController],
  providers: [CareTeamsService],
  exports: [CareTeamsService],
})
export class CareTeamsModule {}
