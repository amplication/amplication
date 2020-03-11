import { createParamDecorator } from '@nestjs/common';
import { Account } from '../models/Account';

export function getUser(ctx): Account {
  return ctx.req.user;
}

export const UserEntity = createParamDecorator(
  (data, [root, args, ctx, info]) => getUser(ctx)
);
