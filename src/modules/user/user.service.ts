import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { SignupDto } from '@modules/auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number) {
    return this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string) {
    return await this.userRepository
      .createQueryBuilder('users')
      .where('users.email = :email')
      .setParameter('email', email)
      .getOne();
  }

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
}
