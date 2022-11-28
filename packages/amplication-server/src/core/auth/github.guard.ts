import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable } from "rxjs";

@Injectable()
export class GitHubAuthGuard extends AuthGuard("github") {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info, context: ExecutionContext, status): any {
    const req = context.switchToHttp().getRequest();
    if (typeof info?.isNew === "boolean") {
      user.isNew = info.isNew;
      req.isNew = info.isNew;
    }
    return super.handleRequest(err, user, info, context, status);
  }
}
