import { Get, Controller, HttpStatus, Render } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from '@modules/main/app.service';
import { ConfigService } from '@nestjs/config';

@Controller()
@ApiTags('healthcheck')
export class AppController {
  constructor(private readonly appService: AppService, private readonly configService: ConfigService) {}

  @Get()
  root() {
    return HttpStatus.OK;
  }

  @Get('config')
  @Render('config') // this is the config.ejs template. Omit .ejs when rendering
  getConfig() {
    return { jwt_expiration_time: this.configService.get('JWT_EXPIRATION_TIME') };
  }

  @Get('ddb_testing')
  ddb_test() {
    this.appService.ddb_test();
    return HttpStatus.OK;
  }
}
