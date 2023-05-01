import { ExceptionFilter, Catch, ArgumentsHost, Inject } from "@nestjs/common";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Env } from "../env";

@Catch(Error)
export class AuthExceptionFilter implements ExceptionFilter {
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

    const clientHost = this.configService.get(Env.CLIENT_HOST);
    response.redirect(
      `${clientHost}/login/?error=${encodeURIComponent(
        exception.message ??
          "Something went wrong. Please try again or contact support"
      )}`
    );
  }
}
