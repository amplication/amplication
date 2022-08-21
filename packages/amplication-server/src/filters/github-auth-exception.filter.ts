import { ExceptionFilter, Catch, ArgumentsHost, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER
} from '@amplication/nest-logger-module';

import { ConfigService } from '@nestjs/config';

@Catch(Error)
export class GithubAuthExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger,
    private readonly configService: ConfigService
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(exception.message, { request });

    response.redirect(`/login/?error=${encodeURIComponent(exception.message)}`);
  }
}
