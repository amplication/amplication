/**
 * Decorators for authorizing and injecting resources to a query / mutation
 */
import { CustomDecorator, SetMetadata } from "@nestjs/common";
import { AuthorizableOriginParameter } from "../enums/AuthorizableOriginParameter";
import {
  AUTHORIZE_CONTEXT,
  AuthorizeContextParameters,
} from "../guards/gql-auth.guard";

/**
 *
 * Authorize given parameter by given parameter type
 * @param parameterType the type of validation to apply on the parameter value
 * @param parameterPath a path to the parameter to be validated
 *
 * The AuthorizeContext data is used inside the graphql guard
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const AuthorizeContext = (
  parameterType: AuthorizableOriginParameter,
  parameterPath: string
): CustomDecorator<string> =>
  SetMetadata<string, AuthorizeContextParameters>(AUTHORIZE_CONTEXT, {
    parameterType,
    parameterPath,
  });
