import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Hash } from '@app/utils/hash.util';
import { UserService } from '@modules/user/user.service';
import { IUser } from '@modules/user/user.interface';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './passport/jwt.strategy';
import { TokenRefreshDto } from './dto/token-refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  async validateUser(dto: LoginDto): Promise<IUser> {
    let user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isPasswordValid = Hash.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    delete user.password;

    return user;
  }

  async createTokenPair(user: IUser) {
    const payload: JwtPayload = {
      sub: user.id,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRATION'),
    });
    const expiresIn = this.configService.get('ACCESS_TOKEN_EXPIRATION');

    await this.userService.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async validateRefreshToken(dto: TokenRefreshDto): Promise<IUser> {
    const { sub, exp } = this.jwtService.verify<JwtPayload>(dto.refreshToken, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
    });

    const user = await this.userService.findOne(sub);

    const isMatchedRefreshToken = Hash.compare(
      dto.refreshToken,
      user.refreshToken,
    );
    if (!isMatchedRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // exp is in second
    const isExpiredRefreshToken = Date.now() > exp * 1000;
    if (isExpiredRefreshToken) {
      throw new UnauthorizedException('Expired refresh token');
    }

    return user;
  }
}
