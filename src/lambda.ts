import { configure as serverlessExpress } from '@vendia/serverless-express';
import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from '@app/modules/main/app.module';

let cachedServe: Handler;

async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);

  await app.init();
  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}


export const handler: Handler = async (event: any, context: Context, callback: Callback) => {
  cachedServe = cachedServe ?? (await bootstrap());
  return cachedServe(event, context, callback);
};

