import { Test, TestingModule } from '@nestjs/testing';
import { RedqueenService } from './redqueen.service';

describe('RedqueenService', () => {
  let service: RedqueenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedqueenService],
    }).compile();

    service = module.get<RedqueenService>(RedqueenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
