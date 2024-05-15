import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Hash } from '@app/utils/hash.util';
import { UsersService } from '@modules/user/user.service';
import { IUser } from '@modules/user/user.interface';
import { SigninDto } from './dto/signin.dto';
import { JwtPayload } from './passport/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {}

  async validateUser(signinDto: SigninDto): Promise<IUser> {
    const user = await this.userService.findByEmail(signinDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isPasswordValid = Hash.compare(signinDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Wrong password.');
    }

    // Exclude() decorator handles this already,
    // but just to be sure
    const { password, ...result } = user;

    return result;
  }

  async createToken(user: IUser) {
    const payload: JwtPayload = {
      sub: user.id,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      expiresIn: this.configService.get('ACCESS_TOKEN_EXPIRATION'),
    };
  }
}
