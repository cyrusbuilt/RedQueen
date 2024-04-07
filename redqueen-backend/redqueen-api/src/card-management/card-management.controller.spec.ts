import { Test, TestingModule } from '@nestjs/testing';
import { CardManagementController } from './card-management.controller';

describe('CardManagementController', () => {
  let controller: CardManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardManagementController],
    }).compile();

    controller = module.get<CardManagementController>(CardManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
