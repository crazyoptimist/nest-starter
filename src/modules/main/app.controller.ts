import { Get, Controller, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NoAuth } from '../common/decorator/no-auth.decorator';

@Controller()
@NoAuth()
@ApiTags('healthcheck')
export class AppController {
  constructor() {}

  @Get()
  root() {
    return HttpStatus.OK;
  }
}
