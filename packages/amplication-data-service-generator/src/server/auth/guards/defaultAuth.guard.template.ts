import { Observable } from "rxjs";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
// @ts-ignore
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

declare class GUARD {
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<any>;
}

@Injectable()
export class DefaultAuthGuard extends GUARD {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<any> {
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler()
    );

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
