import assert from "assert";
import { EnumEntityAction, EnumEntityPermissionType } from "../models";
import { namedTypes } from "ast-types";
import { Entity } from "@amplication/code-gen-types";
import { getClassMethodById, removeDecoratorByName } from "./ast";
import { createPublicDecorator } from "./create-public-decorator";
import { removeIdentifierFromUseInterceptorDecorator } from "./nestjs-code-generation";

export const USE_ROLES_DECORATOR_NAME = "UseRoles";
export const USE_INTERCEPTORS_DECORATOR_NAME = "UseInterceptors";

export const ACL_FILTER_RESPONSE_INTERCEPTOR_NAME =
  "AclFilterResponseInterceptor";
export const ACL_VALIDATE_REQUEST_INTERCEPTOR_NAME =
  "AclValidateRequestInterceptor";

export function setEndpointPermissions(
  classDeclaration: namedTypes.ClassDeclaration,
  methodId: namedTypes.Identifier,
  action: EnumEntityAction,
  entity: Entity
): void {
  const publicAction = entity.permissions.find(
    (entityPermission) =>
      entityPermission.action === action &&
      entityPermission.type === EnumEntityPermissionType.Public
  );

  if (!publicAction) return;

  const classMethod = getClassMethodById(classDeclaration, methodId);
  assert(classMethod);

  if (action === EnumEntityAction.Search || action === EnumEntityAction.View) {
    removeIdentifierFromUseInterceptorDecorator(
      classMethod,
      ACL_FILTER_RESPONSE_INTERCEPTOR_NAME
    );
  }

  if (
    action === EnumEntityAction.Create ||
    action === EnumEntityAction.Update
  ) {
    removeIdentifierFromUseInterceptorDecorator(
      classMethod,
      ACL_VALIDATE_REQUEST_INTERCEPTOR_NAME
    );
  }

  removeDecoratorByName(classMethod, USE_ROLES_DECORATOR_NAME);

  const publicDecorator = createPublicDecorator();
  classMethod.decorators?.unshift(publicDecorator);
}
