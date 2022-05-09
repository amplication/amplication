import { ExecutionContext, Injectable } from "@nestjs/common";
import axios from "axios";
import { decode } from "jsonwebtoken";
import { ExtractJwt } from "passport-jwt";
import { stringifyUrl } from "query-string";
@Injectable()
export class CodeAccessGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    // return this.validate(request);
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
    const url = stringifyUrl({
      url: "http://localhost:3000/generated-apps/canUserAccess",
      query: { buildId, userId },
    });
    const canUserAccess = (await axios.get(url)).data;
    return canUserAccess;
  }
}
