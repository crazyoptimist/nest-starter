import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { SignupDto } from '@modules/auth/dto/signup.dto';
import { UpdateUserDto } from './user.dto';
import {
  FilterParam,
  PaginationParam,
  SortParam,
} from '@app/utils/query-param.util';
import { Role } from './role.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CACHE_PREFIX_USER } from '@app/constants';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
        query.addOrderBy('firstName', sortParam.order);
      }
      if (sortParam.fieldName === 'lastName') {
        query.addOrderBy('lastName', sortParam.order);
      }
    }

    query = query.skip(paginationParam.offset).take(paginationParam.limit);

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
    const isUserExists = await this.userRepository.exists({ where: { id } });
    if (!isUserExists) {
      throw new NotFoundException();
    }

    let { roles: roleNames, ...partialEntity } = dto;

    let roles: Role[] = [];
    if (dto.roles && dto.roles.length > 0) {
      roles = await this.roleRepository.findBy({
        name: In(roleNames),
      });
    }

    const updateDto =
      roles.length > 0
        ? {
            ...partialEntity,
            roles,
            id,
          }
        : {
            ...partialEntity,
            id,
          };

    await this.cacheManager.del(CACHE_PREFIX_USER + id);

    return await this.userRepository.save(updateDto);
  }

  async delete(id: number) {
    return await this.userRepository.delete(id);
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    return await this.userRepository.update(id, {
      refreshToken,
    });
  }

  async deleteRefreshToken(id: number) {
    return await this.userRepository.manager.connection
      .query(`UPDATE users SET refresh_token = NULL WHERE id = $1`, [id])
      .catch((e) => console.log(e));
  }
}
