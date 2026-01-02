import { Test, TestingModule } from '@nestjs/testing';
import { CareTeamsService } from './care-teams.service';

describe('CareTeamsService', () => {
  let service: CareTeamsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CareTeamsService],
    }).compile();

    service = module.get<CareTeamsService>(CareTeamsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
