import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from '@app/modules/main/app.module';
import { ReplaySubject, firstValueFrom } from 'rxjs';

//Declare a ReplaySubject to store the serverlessExpress instance.
const serverSubject = new ReplaySubject<Handler>()

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);

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

