import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

type ResponseBody = {
  statusCode: number;
  message: string | string[];
  error: string;
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

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
      this.logger.error((exception as Error).stack);

      const isDuplicateKeyError = exception.message?.includes(
        'duplicate key value violates unique constraint',
      );

      statusCode = isDuplicateKeyError
        ? HttpStatus.BAD_REQUEST
        : HttpStatus.INTERNAL_SERVER_ERROR;

      const message = isDuplicateKeyError
        ? exception.message
        : 'Service Unavailable';

      responseBody = {
        statusCode,
        message,
        error: 'Query Failed Error',
      };
    } else if (exception instanceof EntityNotFoundError) {
      statusCode = HttpStatus.NOT_FOUND;
      responseBody = {
        statusCode,
        message: exception.message,
        error: 'Record Not Found Error',
      };
    } else {
      this.logger.error((exception as Error).stack);

      statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      responseBody = {
        statusCode,
        message: 'Service Unavailable',
        error: 'Internal Server Error',
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, statusCode);
  }
}
