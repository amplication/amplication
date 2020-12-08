import { builders } from "ast-types";
import { pascalCase } from "pascal-case";
import { print } from "recast";
import { createDTOFile } from "../server/resource/dto/create-dto-module";
import { Role, Module } from "../types";
import { SRC_DIRECTORY } from "./constants";

const ENUM_ROLES_ID = builders.identifier("EnumRoles");
const MODULE_PATH = `${SRC_DIRECTORY}/user/${ENUM_ROLES_ID.name}.ts`;

export function createEnumRolesModule(roles: Role[]): Module {
  const enumDeclaration = builders.tsEnumDeclaration(
    ENUM_ROLES_ID,
    roles.map((role) =>
      builders.tsEnumMember(
        builders.identifier(pascalCase(role.displayName)),
        builders.stringLiteral(role.name)
      )
    )
  );
  const file = createDTOFile(enumDeclaration, MODULE_PATH, {});
  return {
    path: MODULE_PATH,
    code: print(file).code,
  };
}
