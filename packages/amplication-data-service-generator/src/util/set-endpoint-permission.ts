import assert from "assert";
import { EnumEntityAction, EnumEntityPermissionType } from "../models";
import { namedTypes } from "ast-types";
import { Entity } from "../types";
import { removeDecoratorByName, getClassMethodById } from "./ast";
import { createPublicDecorator } from "./create-public-decorator";
import { removeIdentifierFromUseInterceptorDecorator } from "./nestjs-code-generation";

export const USE_ROLES_DECORATOR_NAME = "UseRoles";
export const USE_INTERCEPTORS_DECORATOR_NAME = "UseInterceptors";
export const PUBLIC_DECORATOR_NAME = "Public";

const ACL_FILTER_RESPONSE_INTERCEPTOR_NAME = "AclFilterResponseInterceptor";
const ACL_VALIDATE_REQUEST_INTERCEPTOR_NAME = "AclValidateRequestInterceptor";

export function setEndpointPermissions(
  classDeclaration: namedTypes.ClassDeclaration,
  methodId: namedTypes.Identifier,
  action: EnumEntityAction,
  entity: Entity
): void {
  entity.permissions.find((entityPermission) => {
    if (entityPermission.action === action) {
      if (entityPermission.type === EnumEntityPermissionType.Public) {
        const classMethod = getClassMethodById(classDeclaration, methodId);
        assert(classMethod);

        if (
          action === EnumEntityAction.Search ||
          action === EnumEntityAction.View
        ) {
          removeIdentifierFromUseInterceptorDecorator(
            classMethod,
            USE_INTERCEPTORS_DECORATOR_NAME,
            ACL_FILTER_RESPONSE_INTERCEPTOR_NAME
          );
        }

        if (
          action === EnumEntityAction.Create ||
          action === EnumEntityAction.Update
        ) {
          removeIdentifierFromUseInterceptorDecorator(
            classMethod,
            USE_INTERCEPTORS_DECORATOR_NAME,
            ACL_VALIDATE_REQUEST_INTERCEPTOR_NAME
          );
        }

        removeDecoratorByName(classMethod, USE_ROLES_DECORATOR_NAME);

        const publicDecorator = createPublicDecorator();
        classMethod.decorators?.push(publicDecorator);
        /** @todo: add import conditionally */
      }
      return entity;
    }
    return undefined;
  });
}
