/**
 * Decorators for authorizing and injecting resources to a query / mutation
 */

import { SetMetadata } from '@nestjs/common';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import {
  AUTHORIZE_CONTEXT,
  AuthorizeContextParameters
} from 'src/guards/gql-auth.guard';

/**
 * Authorize given parameter by given parameter type
 * @param parameterType the type of validation to apply on the parameter value
 * @param parameterPath a path to the parameter to be validated
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthorizeContext = (
  parameterType: AuthorizableResourceParameter,
  parameterPath: string
) =>
  SetMetadata<string, AuthorizeContextParameters>(AUTHORIZE_CONTEXT, {
    parameterType,
    parameterPath
  });
