import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { SignupDto } from '@modules/auth/dto/signup.dto';
import { UpdateUserDto } from './user.dto';
import {
  FilterParam,
  PaginationParam,
  SortParam,
} from '@app/utils/query-param.util';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(signupDto: SignupDto) {
    const user = await this.findByEmail(signupDto.email);

    if (user) {
      throw new ConflictException(
        'A user with the provided email already exists.',
      );
    }

    return await this.userRepository.save(
      this.userRepository.create(signupDto),
    );
  }

  async findAll(
    paginationParam: PaginationParam,
    sortParams: SortParam[],
    filterParams: FilterParam[],
  ): Promise<{ users: User[]; totalCount: number }> {
    let query: SelectQueryBuilder<User> =
      this.userRepository.createQueryBuilder('users');

    for (const filterParam of filterParams) {
      if (filterParam.fieldName === 'email') {
        query.andWhere('email = :email', {
          email: filterParam.value,
        });
      }
      if (filterParam.fieldName === 'firstName') {
        query.andWhere('first_name = :firstName', {
          firstName: filterParam.value,
        });
      }
      if (filterParam.fieldName === 'lastName') {
        query.andWhere('last_name = :lastName', {
          lastName: filterParam.value,
        });
      }
    }

    const totalCount = await query.getCount();

    for (const sortParam of sortParams) {
      if (sortParam.fieldName === 'email') {
        query.addOrderBy('email', sortParam.order);
      }
      if (sortParam.fieldName === 'firstName') {
        query.addOrderBy('first_name', sortParam.order);
      }
      if (sortParam.fieldName === 'lastName') {
        query.addOrderBy('last_name', sortParam.order);
      }
    }

    query = query.offset(paginationParam.offset).limit(paginationParam.limit);

    const users = await query.getMany();

    return { users, totalCount };
  }

  async findOne(id: number) {
    // This is a known issue in TypeORM
    if (!Number(id)) {
      throw new NotFoundException();
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async update(id: number, dto: UpdateUserDto) {
    return await this.userRepository.update(id, dto);
  }

  async delete(id: number) {
    return await this.userRepository.delete(id);
  }
}
