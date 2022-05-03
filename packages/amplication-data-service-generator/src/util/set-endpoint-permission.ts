import assert from "assert";
import { EnumEntityAction, EnumEntityPermissionType } from "../models";
import { namedTypes } from "ast-types";
// eslint-disable-next-line import/no-unresolved
import { Entity } from "types";
import { deleteDecoratorByName, getClassMethodById } from "./ast";
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

        // remove UseInterceptor
        assert(classMethod);
        // const interceptorDecorator = findFirstDecoratorByName(
        //   classMethod,
        //   USE_INTERCEPTORS_DECORATOR_NAME
        // );
        // console.log(interceptorDecorator);

        // remove UseRoles
        const rolesDecorator = deleteDecoratorByName(
          classMethod,
          USE_ROLES_DECORATOR_NAME
        );
        console.log(rolesDecorator);

        // add Public
        const publicDecorator = createPublicDecorator();
        classMethod.decorators?.push(publicDecorator);
      }
    }
    return null;
  });
}
