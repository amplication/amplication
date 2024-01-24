import { Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { auth } from "express-openid-connect";
import { Env } from "../../env";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { AuthService } from "./auth.service";

@Injectable()
export class Auth0Middleware implements NestMiddleware {
  private middleware: RequestHandler;
  private clientHost: string;

  constructor(
    configService: ConfigService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly authService: AuthService
  ) {
    this.clientHost = configService.get(Env.CLIENT_HOST);
    const baseURL = `${configService.get(Env.HOST)}`;

    const issuerBaseUrl = configService.get(Env.AUTH_ISSUER_BASE_URL);
    const clientID = configService.get(Env.AUTH_ISSUER_CLIENT_ID);
    const clientSecret = configService.get(Env.AUTH_ISSUER_CLIENT_SECRET);

    this.middleware = auth({
      authRequired: false,
      authorizationParams: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        response_type: "code",
        scope: "openid profile email",
      },
      idpLogout: true,
      clientID,
      clientSecret,
      baseURL: `${baseURL}/auth`,
      routes: {
        login: false,
        logout: false,
        postLogoutRedirect: `${this.clientHost}/login`,
      },
      issuerBaseURL: `https://${issuerBaseUrl}`,
      secret: clientSecret,
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    this.middleware(req, res, next);
  }
}
