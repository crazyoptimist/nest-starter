import { Get, Controller, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('healthcheck')
export class AppController {
  constructor() {}

  @Get()
  root() {
    return HttpStatus.OK;
  }
}
