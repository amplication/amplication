import { SetMetadata, applyDecorators } from "@nestjs/common";
import { InjectableOriginParameter } from "../enums/InjectableOriginParameter";
import {
  INJECT_CONTEXT_VALUE,
  InjectContextValueParameters,
} from "../interceptors/inject-context.interceptor";
import { RolesPermissions } from "@amplication/util-roles-types";
import {
  AUTHORIZE_CONTEXT,
  AuthorizeContextParameters,
} from "../guards/gql-auth.guard";
import { AuthorizableOriginParameter } from "../enums/AuthorizableOriginParameter";

/**
 * Inject given parameter type as given parameter
 * @param parameterType the type of parameter value to inject
 * @param parameterPath a path to the parameter to be injected to
 * @param permissions optional permissions for authorization
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export const InjectContextValue = (
  parameterType: InjectableOriginParameter,
  parameterPath: string,
  permissions?: RolesPermissions[] | RolesPermissions
) => {
  const decorators = [];

  // If permissions are provided, set the AUTHORIZE_CONTEXT metadata
  if (permissions) {
    const requiredPermissions = Array.isArray(permissions)
      ? permissions
      : [permissions];

    decorators.push(
      SetMetadata<string, AuthorizeContextParameters>(AUTHORIZE_CONTEXT, {
        parameterType: AuthorizableOriginParameter.None,
        parameterPath: "",
        requiredPermissions,
      })
    );
  }

  // Always set the INJECT_CONTEXT_VALUE metadata
  decorators.push(
    SetMetadata<string, InjectContextValueParameters>(INJECT_CONTEXT_VALUE, {
      parameterType,
      parameterPath,
    })
  );

  // Combine all decorators into one
  return applyDecorators(...decorators);
};
