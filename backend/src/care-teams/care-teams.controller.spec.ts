import { Test, TestingModule } from '@nestjs/testing';
import { CareTeamsController } from './care-teams.controller';

describe('CareTeamsController', () => {
  let controller: CareTeamsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CareTeamsController],
    }).compile();

    controller = module.get<CareTeamsController>(CareTeamsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
