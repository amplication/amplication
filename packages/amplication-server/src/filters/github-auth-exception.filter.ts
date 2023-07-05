import { ExceptionFilter, Catch, ArgumentsHost, Inject } from "@nestjs/common";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Catch(Error)
export class GithubAuthExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly configService: ConfigService
  ) {}

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    this.logger.error(exception.message, exception, { request });

    response.redirect(`/login/?error=${encodeURIComponent(exception.message)}`);
  }
}
