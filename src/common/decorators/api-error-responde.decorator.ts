import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiErrorResponse = (
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
) => {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: statusCode },
          code: { type: 'string', example: code },
          message: { type: 'string', example: message },
          ...(details
            ? { details: { type: 'object', nullable: true, example: details } }
            : {}),
        },
      },
    }),
  );
};
