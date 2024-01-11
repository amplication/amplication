import { User } from "../models";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export function getUser(executionContext: ExecutionContext): User {
  const gqlExecutionContext = GqlExecutionContext.create(executionContext);
  return gqlExecutionContext.getContext().req.user;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const UserEntity = createParamDecorator((data, ctx: ExecutionContext) =>
  getUser(ctx)
);
