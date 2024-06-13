import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

type ResponseBody = {
  statusCode: number;
  message: string | string[];
  error: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let statusCode: number;
    let responseBody: ResponseBody;

    // We now handle both HTTP and non-HTTP errors comprehensively.
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      responseBody = exception.getResponse() as ResponseBody;
    } else if (exception instanceof QueryFailedError) {
      statusCode = HttpStatus.BAD_REQUEST;
      responseBody = {
        statusCode,
        message: exception.message,
        error: 'Database Query Failed Error',
      };
    } else {
      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        statusCode,
        message: (exception as Error).message,
        error: 'Internal Server Error',
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
