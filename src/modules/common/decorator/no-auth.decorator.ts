import { SetMetadata } from '@nestjs/common';

export const IS_NO_AUTH_KEY = 'isNoAuth';
export const NoAuth = () => SetMetadata(IS_NO_AUTH_KEY, true);
