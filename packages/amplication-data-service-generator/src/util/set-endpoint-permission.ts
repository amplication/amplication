import assert from "assert";
import { EnumEntityAction, EnumEntityPermissionType } from "../models";
import { namedTypes } from "ast-types";
import { Entity } from "../types";
import {
  deleteDecoratorPropertyByName,
  getClassMethodById,
  setDecoratorState,
} from "./ast";
import { createPublicDecorator } from "./create-public-decorator";

export const USE_ROLES_DECORATOR_NAME = "UseRoles";
export const USE_INTERCEPTORS_DECORATOR_NAME = "UseInterceptors";
export const PUBLIC_DECORATOR_NAME = "Public";

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
          setDecoratorState(
            classMethod,
            USE_INTERCEPTORS_DECORATOR_NAME,
            "AclFilterResponseInterceptor"
          );
        }

        if (
          action === EnumEntityAction.Create ||
          action === EnumEntityAction.Update
        ) {
          setDecoratorState(
            classMethod,
            USE_INTERCEPTORS_DECORATOR_NAME,
            "AclValidateRequestInterceptor"
          );
        }

        deleteDecoratorPropertyByName(classMethod, USE_ROLES_DECORATOR_NAME);

        const publicDecorator = createPublicDecorator();
        classMethod.decorators?.push(publicDecorator);
        /** @todo: add import conditionally */
      }
      return entity;
    }
    return undefined;
  });
}
