//Authorization decorator to be used on resolvers and controllers together with the jwt-guard

import { CustomDecorator, SetMetadata } from "@nestjs/common";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Roles = (...roles: string[]): CustomDecorator<string> =>
  SetMetadata("roles", roles);
