import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryManagementController } from './telemetry-management.controller';

describe('TelemetryManagementController', () => {
  let controller: TelemetryManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelemetryManagementController],
    }).compile();

    controller = module.get<TelemetryManagementController>(
      TelemetryManagementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
