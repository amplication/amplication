import { Reflector } from "@nestjs/core";
import { ExecutionContext } from "@nestjs/common";
// @ts-ignore
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

declare class GUARD {
  canActivate(context: ExecutionContext): boolean | Promise<boolean>;
}

export class DefaultAuthGuard extends GUARD {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let parentCanActivate = false;

    try {
      parentCanActivate = (await super.canActivate(context)) as boolean;
    } catch (err) {
      parentCanActivate = false;
    }

    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler()
    );

    return isPublic || parentCanActivate;
  }
}
