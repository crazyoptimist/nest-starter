import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { Callback, Context, Handler } from 'aws-lambda';
import { useContainer } from 'class-validator';
import { ReplaySubject, firstValueFrom } from 'rxjs';
import { TrimStringsPipe } from '@app/modules/common/transformer/trim-strings.pipe';
import { setupSwagger } from '@app/swagger';
import { AppModule } from '@app/modules/main/app.module';


//Declare a ReplaySubject to store the serverlessExpress instance.
const serverSubject = new ReplaySubject<Handler>()

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.enableCors();
  app.useGlobalPipes(
    new TrimStringsPipe(),
    new ValidationPipe({ whitelist: true }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

//Do not wait for lambdaHandler to be called before bootstraping Nest.
//Pass the result of bootstrap() into the ReplaySubject
bootstrap().then(server => serverSubject.next(server))


export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
    //Convert the ReplaySubject to a Promise.
    //Wait for bootstrap to finish, then start handling requests.
    const server = await firstValueFrom(serverSubject)
    return server(event, context, callback);
};

