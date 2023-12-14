import { Test, TestingModule } from '@nestjs/testing';
import { InfraCostController } from './infra-cost.controller';
import { InfraCostService } from './infra-cost.service';

describe('InfraCostController', () => {
  let controller: InfraCostController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfraCostController],
      providers: [
        {
          provide: InfraCostService,
          useValue: {
            getCostAndUsage: jest.fn(), // mock the methods you use from InfraCostService
          },
        }
      ]
    }).compile();

    controller = module.get<InfraCostController>(InfraCostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
