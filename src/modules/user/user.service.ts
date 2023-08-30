import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { SignupDto } from '@modules/auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async get(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async getByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

  async getByEmailOrPhone(email?: string, phone?: string) {
    const queryBuilder = this.userRepository.createQueryBuilder('users');

    if (email && phone) {
      queryBuilder
        .where('users.email = :email OR users.phone = :phone')
        .setParameters({ email, phone });
    } else if (email) {
      queryBuilder
        .where('users.email = :email')
        .setParameter('email', email);
    } else if (phone) {
      queryBuilder
        .where('users.phone = :phone')
        .setParameter('phone', phone);
    } else {
      throw new Error('Either email or phone must be provided');
    }

    return await queryBuilder.getOne();
  }

  async create(signupDto: SignupDto) {
    const user = await this.getByEmailOrPhone(signupDto.email, signupDto.phone);

    if (user) {
      if (user.email === signupDto.email) {
        throw new NotAcceptableException(
          'User with provided email already exists',
        );
      } else if (user.phone === signupDto.phone) {
        throw new NotAcceptableException(
          'User with provided phone already exists',
        );
      }
    }

    return await this.userRepository.save(
      this.userRepository.create(signupDto),
    );
  }

  async getUsersCount(): Promise<number> {
    return await this.userRepository.count();
  }
}
