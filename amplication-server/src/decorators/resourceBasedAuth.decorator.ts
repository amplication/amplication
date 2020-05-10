//Authorization decorator to be used on resolvers and controllers together with the jwt-guard

import { SetMetadata } from '@nestjs/common';
import {
  ResourceBasedAuthParams,
  ResourceBasedAuthParamType
} from './resourceBasedAuthParams.dto';

export const ResourceBasedAuth = (
  parameterName: string,
  parameterType: ResourceBasedAuthParamType,
  applyFromContext: boolean = false
) =>
  SetMetadata('resourceBasedAuth', {
    param: parameterName,
    type: parameterType,
    applyFromContext
  });
