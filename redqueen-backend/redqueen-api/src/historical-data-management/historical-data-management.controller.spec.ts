import { Test, TestingModule } from '@nestjs/testing';
import { HistoricalDataManagementController } from './historical-data-management.controller';

describe('HistoricalDataManagementController', () => {
  let controller: HistoricalDataManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoricalDataManagementController],
    }).compile();

    controller = module.get<HistoricalDataManagementController>(
      HistoricalDataManagementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
