import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ROLES_KEY = 'roles';
export const ApiSuccessResponse = (
  statusCode: number,
  message: string,
  data?: unknown,
  hasPagination?: boolean,
) => {
  return applyDecorators(
    ApiResponse({
      status: statusCode,
      schema: {
        type: 'object',
        properties: {
          statusCode: { type: 'number', example: statusCode },
          message: { type: 'string', example: message },
          data: { type: Array.isArray(data) ? 'array' : 'object', example: data },
          ...(hasPagination
            ? {
                meta: {
                  type: 'object',
                  nullable: true,
                  example: hasPagination
                    ? {
                        total: 100,
                        page: 1,
                        lastPage: 10,
                      }
                    : null,
                },
              }
            : {}),
        },
      },
    }),
  );
};
