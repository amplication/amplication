import { ExecutionContext, Injectable } from "@nestjs/common";
import { decode } from "jsonwebtoken";
import { ExtractJwt } from "passport-jwt";
import { QueueService } from "../queue/queue.service";
@Injectable()
export class CodeAccessGuard {
  constructor(protected readonly queueService: QueueService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    if (!token) {
      return false;
    }
    const data = decode(token);
    if (!data || typeof data !== "object") {
      return false;
    }

    const { userId } = data;
    const { buildId } = request.params;
    const canUserAccess = await this.queueService.canAccessBuild(
      userId,
      buildId
    );
    return canUserAccess;
  }
}
