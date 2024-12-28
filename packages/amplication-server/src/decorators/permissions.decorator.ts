//Authorization decorator to be used on resolvers and controllers together with the jwt-guard

import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { RolesPermissions } from "@amplication/util-roles-types";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const Permissions = (
  ...permissions: RolesPermissions[]
): CustomDecorator<string> => SetMetadata("permissions", permissions);
