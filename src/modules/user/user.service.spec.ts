import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';

import { UsersService } from './user.service';
import { User } from './user.entity';
import { AppModule } from '../main/app.module';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;
  let module: TestingModule;

  const fixture = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'admin@example.com',
    password: 'mypassword',
    passwordConfirmation: 'mypassword',
  };

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User])],
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => await repository.clear());

  afterAll(async () => {
    const dataSource = module.get<DataSource>(getDataSourceToken());
    await dataSource.destroy();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      await service.create(fixture);
      const count = await repository.count();
      expect(count).toBe(1);
    });
  });

  describe('get', () => {
    it('should return a user', async () => {
      const { id } = await repository.save(fixture);
      const user = await service.get(id);
      expect(user?.id).toBe(id);
    });
  });

  describe('getByEmail', () => {
    it('should return a user with the email', async () => {
      await repository.save(fixture);
      const email = fixture.email;
      const user = await service.getByEmail(email);
      expect(user?.email).toBe(email);
    });
  });
});
