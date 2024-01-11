import { DefaultAuthGuard } from "./defaultAuth.guard";
import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Request } from "express";

export class GqlDefaultAuthGuard extends DefaultAuthGuard {
  // This method is required for the interface - do not delete it.
  getRequest<Request>(context: ExecutionContext): Request {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: Request }>().req;
  }
}
