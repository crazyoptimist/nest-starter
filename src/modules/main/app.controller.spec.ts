import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [ConfigModule],
    }).compile();
  });

  describe('root', () => {
    it('should return "200"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.root()).toBe(HttpStatus.OK);
    });
  });
});
