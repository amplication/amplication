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

    // @todo create a login error page with details
    // response.redirect(`/login/?error=${encodeURIComponent(exception.message)}`);
    const clientHost = this.configService.get(Env.CLIENT_HOST);
    response.redirect(
      `${clientHost}/login/?error=${encodeURIComponent(exception.message)}`
    );
  }
}
