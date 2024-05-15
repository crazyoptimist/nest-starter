import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_NO_AUTH_KEY } from '@app/modules/common/decorator/no-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isNoAuth = this.reflector.getAllAndOverride<boolean>(IS_NO_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isNoAuth) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err: Error, user: any, _info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
