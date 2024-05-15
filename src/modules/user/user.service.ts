import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { SignupDto } from '@modules/auth/dto/signup.dto';
import { UpdateUserDto } from './user.dto';

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

  async findAll() {
    return await this.userRepository.find();
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
