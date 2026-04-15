import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppException } from '../exceptions/app.exception';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details = null;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse() as any;

      message = res.message || exception.message;

      // If it is our AppException, we extract the extra fields
      if (exception instanceof AppException) {
        code = exception.code;
        details = exception.details;
      } else {
        // For standard Nest errors (404 NotFound)
        code = `ERR_${statusCode}`;
        // In validation errors (class-validator), the message is usually an array
        details = res.message || null;
      }
    } else {
      // Pure code errors (syntax errors, database errors)
      console.error(exception);
      message = exception.message || 'Unexpected error occurred';
    }

    response.status(statusCode).json({
      statusCode,
      code,
      message: Array.isArray(message) ? message[0] : message,
      details,
    });
  }
}
