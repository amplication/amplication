import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

/**
 * Access the user roles from the request object i.e `req.user.roles`.
 *
 * You can pass an optional property key to the decorator to get it from the user object
 * e.g `@UserRoles('permissions')` will return the `req.user.permissions` instead.
 */
export const UserRoles = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<{ req: { user: any } }>().req;
    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user.roles;
  }
);
