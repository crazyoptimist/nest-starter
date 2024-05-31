import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { UserService } from '@app/modules/user/user.service';
import { CACHE_PREFIX_USER } from '@app/constants';
import { User } from '@app/modules/user/user.entity';

const CACHE_USER_TTL = 86400;

export type JwtPayload = {
  iat?: number;
  exp?: number;
  sub: number;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('ACCESS_TOKEN_SECRET'),
    });
  }

  // This function should return a user object,
  // which will then be injected into the request object by Nest.
  async validate({ sub }: JwtPayload) {
    let user: User;

    const stringifiedUser = await this.cacheManager.get<string>(
      CACHE_PREFIX_USER + sub,
    );

    if (!stringifiedUser) {
      user = await this.userService.findOne(sub);
      if (!user) {
        throw new UnauthorizedException();
      }

      const { password, ...result } = user;

      this.cacheManager.set(
        CACHE_PREFIX_USER + sub,
        JSON.stringify(result),
        CACHE_USER_TTL,
      );
    } else {
      user = await JSON.parse(stringifiedUser);
    }

    const { password, ...result } = user;

    return result;
  }
}
