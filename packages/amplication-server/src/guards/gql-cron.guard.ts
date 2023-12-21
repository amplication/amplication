import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Env } from "../env";
import { ConfigService } from "@nestjs/config";

const HEADER_KEY = "x-cron-secret";

@Injectable()
export class GqlCronGuard implements CanActivate {
  private readonly cronSecretKey: string;

  constructor(private readonly configService: ConfigService) {
    this.cronSecretKey = this.configService.get<string>(Env.CRON_SECRET_KEY);
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const secretKey = request.headers[HEADER_KEY];

    if (secretKey !== this.cronSecretKey) {
      throw new UnauthorizedException("Invalid cron secret key");
    }

    return true;
  }
}
