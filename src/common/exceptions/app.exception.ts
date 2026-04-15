import { HttpException, HttpStatus } from '@nestjs/common';

export class AppException extends HttpException {
  constructor(
    public readonly message: string,
    public readonly code: string,
    public readonly statusCode: number = HttpStatus.BAD_REQUEST,
    public readonly details?: any,
  ) {
    super(message, statusCode);
  }
}