import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

interface PostgresError extends QueryFailedError {
  code: string;
  detail?: string;
  constraint?: string;
  table?: string;
}

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error = exception as PostgresError;

    if (error.code === '23505') {
      // Unique violation
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Duplicate entry',
        detail: error.detail || 'A unique constraint was violated',
        /* constraint: error.constraint,
        table: error.table, */
        error: 'Bad Request',
      });
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Database error',
      error: error.message || 'An unexpected database error occurred',
    });
  }
}
