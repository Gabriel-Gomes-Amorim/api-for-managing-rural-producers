import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError } from './app-error';

@Catch()
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (exception instanceof AppError) {
      response.status(exception.status ?? HttpStatus.BAD_REQUEST).json({
        message: exception.message,
        code: exception.code ?? 'ERROR',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else if (exception instanceof BadRequestException) {
      const exceptionResponse = exception.getResponse() as {
        message: string[] | string;
      };

      response.status(HttpStatus.BAD_REQUEST).json({
        errors: Array.isArray(exceptionResponse.message)
          ? exceptionResponse.message
          : [exceptionResponse.message],
        code: 'VALIDATION_ERROR',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        message: exception.message,
        code: 'HTTP_ERROR',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
