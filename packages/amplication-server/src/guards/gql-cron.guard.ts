import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Env } from "../env";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";

const HEADER_KEY = "x-cron-secret";

@Injectable()
export class GqlCronGuard implements CanActivate {
  private readonly cronSecretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.cronSecretKey = this.configService.get<string>(Env.CRON_SECRET_KEY);
  }

  canActivate(context: ExecutionContext): boolean {
    const gqlCtx = GqlExecutionContext.create(context);
    const request = gqlCtx.getContext().req;
    const secretKey = request.headers[HEADER_KEY];

    if (!this.cronSecretKey || secretKey !== this.cronSecretKey) {
      throw new UnauthorizedException("Invalid cron secret key");
    }

    return true;
  }
}
