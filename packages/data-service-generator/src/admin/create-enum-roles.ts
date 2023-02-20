import { builders, namedTypes } from "ast-types";
import { pascalCase } from "pascal-case";
import { print } from "@amplication/code-gen-utils";
import { createDTOFile } from "../server/resource/dto/create-dto-module";
import { Role, Module } from "@amplication/code-gen-types";
import DsgContext from "../dsg-context";

export const ENUM_ROLES_ID = builders.identifier("EnumRoles");

export function createEnumRolesModule(roles: Role[]): Module {
  const { clientDirectories } = DsgContext.getInstance;
  const MODULE_PATH = `${clientDirectories.srcDirectory}/user/${ENUM_ROLES_ID.name}.ts`;
  const enumDeclaration = createRolesEnumDeclaration(roles);
  const file = createDTOFile(enumDeclaration, MODULE_PATH, {});
  return {
    path: MODULE_PATH,
    code: print(file).code,
  };
}

export function createRolesEnumDeclaration(
  roles: Role[]
): namedTypes.TSEnumDeclaration {
  return builders.tsEnumDeclaration(
    ENUM_ROLES_ID,
    roles.map((role) =>
      builders.tsEnumMember(
        builders.identifier(pascalCase(role.displayName)),
        builders.stringLiteral(role.name)
      )
    )
  );
}
