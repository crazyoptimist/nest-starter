import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { SignupDto } from './../auth/dto/signup.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    // create a mock repository object
    const mockRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(null),
      })),
      count: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(
      getRepositoryToken(User, undefined),
    );
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const signupDto: SignupDto = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'mypassword',
        passwordConfirmation: 'mypassword',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(null); // Mock no existing user with the same email
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(null),
      } as any);
      jest.spyOn(repository, 'create').mockReturnValue(signupDto as any);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(signupDto as any);

      const result = await service.create(signupDto);

      expect(repository.create).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(signupDto);
    });
  });

  describe('get', () => {
    it('should return a user by ID', async () => {
      const userId = 1;
      const mockUser: User = {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await service.get(userId);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'test@example.com';
      const mockUser: User = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email,
        password: 'password',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        where: jest.fn().mockReturnThis(),
        setParameter: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(mockUser),
      } as any);

      const result = await service.getByEmail(email);

      expect(repository.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });
  });

  describe('getUsersCount', () => {
    it('should return the count of users', async () => {
      const mockCount = 5;

      jest.spyOn(repository, 'count').mockResolvedValueOnce(mockCount);

      const result = await service.getUsersCount();

      expect(repository.count).toHaveBeenCalled();
      expect(result).toBe(mockCount);
    });
  });
});