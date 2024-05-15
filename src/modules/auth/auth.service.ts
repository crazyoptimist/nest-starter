import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Hash } from '@app/utils/hash.util';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@modules/user/user.service';
import { User } from '@modules/user/user.entity';
import { SigninDto } from './dto/signin.dto';
import { JwtPayload } from './jwt/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async createToken(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
    };

    return {
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUser(signinDto: SigninDto): Promise<User> {
    const user = await this.userService.getByEmail(signinDto.email);

    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    if (!Hash.compare(signinDto.password, user.password)) {
      throw new UnauthorizedException('Wrong password.');
    }

    return user;
  }
}
