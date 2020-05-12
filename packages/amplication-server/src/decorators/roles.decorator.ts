//Authorization decorator to be used on resolvers and controllers together with the jwt-guard

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
