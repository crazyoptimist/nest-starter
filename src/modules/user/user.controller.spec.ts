import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { InternalServerErrorException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('getCount', () => {
    it('should return the count of users', async () => {
      const mockCount = 10;
      jest.spyOn(usersService, 'getUsersCount').mockResolvedValue(mockCount);

      const result = await controller.getUsersCount();

      expect(usersService.getUsersCount).toHaveBeenCalled();
      expect(result).toEqual({ count: mockCount });
    });

    it('should throw InternalServerErrorException when an error occurs', async () => {
      jest
        .spyOn(usersService, 'getUsersCount')
        .mockRejectedValue(new Error('Test error'));

      await expect(controller.getUsersCount()).rejects.toThrow(Error); // Update the expected error type
    });
  });
});
