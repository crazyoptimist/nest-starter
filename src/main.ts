import 'source-map-support/register';

import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

import { AppModule } from './modules/main/app.module';
import { setupSwagger } from './swagger';
import { TrimStringsPipe } from './modules/common/pipe/trim-strings.pipe';
import { TOTAL_COUNT_HEADER_KEY } from './constants';

declare const module: any;

const APP_PORT = 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  app.enableCors({
    exposedHeaders: [TOTAL_COUNT_HEADER_KEY],
  });

  app.useGlobalPipes(
    new TrimStringsPipe(),
    new ValidationPipe({ whitelist: true }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(APP_PORT);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

bootstrap();
