import { Test, TestingModule } from '@nestjs/testing';
import { SnsController } from './sns.controller';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

describe('SnsController', () => {
  let controller: SnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnsController],
      providers: [
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(), // mock the methods you use from HttpService
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(), // mock the methods you use from ConfigService
          },
        },
      ],
    }).compile();

    controller = module.get<SnsController>(SnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
