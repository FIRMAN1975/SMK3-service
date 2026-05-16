import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import { parseErrorMessage } from './validation';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      const rawMessage =
        typeof payload === 'string'
          ? payload
          : Array.isArray((payload as { message?: unknown }).message)
            ? ((payload as { message: string[] }).message ?? []).join('|')
            : typeof (payload as { message?: unknown }).message === 'string'
              ? (payload as { message: string }).message
              : exception.message;

      const parsed = parseErrorMessage(rawMessage);
      const hasParsedData = Object.keys(parsed).length > 0;

      response.status(status).json({
        status: status >= HttpStatus.INTERNAL_SERVER_ERROR ? 'error' : 'fail',
        message: hasParsedData ? 'Data tidak valid' : rawMessage,
        data: hasParsedData ? JSON.stringify(parsed) : null,
      });
      return;
    }

    const message = exception instanceof Error ? exception.message : 'Unknown error';
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      message,
      data: '',
    });
  }
}