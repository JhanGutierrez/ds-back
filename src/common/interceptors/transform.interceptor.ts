import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        const isPaginated = data?.results && data?.total !== 'undefined';

        return {
          statusCode: response.statusCode,
          message: data?.message || 'Operación exitosa',
          data: isPaginated ? data.results : data?.data || data,
          meta: isPaginated
            ? { total: data.total, page: data.page, lastPage: data.lastPage }
            : data?.meta,
        };
      }),
    );
  }
}

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: any;
}
