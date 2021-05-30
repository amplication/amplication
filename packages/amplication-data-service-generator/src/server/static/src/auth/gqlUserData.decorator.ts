import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { UserInfo } from "./UserInfo";

/**
 * Access the user data from the request object i.e `req.user`.
 */
export function getUser(executionContext: ExecutionContext): UserInfo {
  const gqlExecutionContext = GqlExecutionContext.create(executionContext);
  return gqlExecutionContext.getContext().req.user;
}

export const UserData = createParamDecorator((data, ctx: ExecutionContext) =>
  getUser(ctx)
);
