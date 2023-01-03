import { pascalCase } from "pascal-case";
import { print } from "@amplication/code-gen-utils";
import { Role } from "@amplication/code-gen-types";
import {
  createEnumRolesModule,
  createRolesEnumDeclaration,
  ENUM_ROLES_ID,
} from "./create-enum-roles";
import DsgContext from "../dsg-context";

const context = DsgContext.getInstance;
context.clientDirectories = {
  baseDirectory: "baseDirectory",
  srcDirectory: "admin-ui/src",
  authDirectory: "authDirectory",
  publicDirectory: "publicDirectory",
  apiDirectory: "apiDirectory",
};

const EXAMPLE_ROLE = {
  name: "exampleRole",
  displayName: "Example Role",
  description: "Example Role Description",
};
const OTHER_EXAMPLE_ROLE = {
  name: "otherExampleRole",
  displayName: "Other Example Role",
  description: "Other Example Role Description",
};
const EXAMPLE_ROLES: Role[] = [EXAMPLE_ROLE, OTHER_EXAMPLE_ROLE];
const EXPECTED_DECLARATION_CODE = `enum ${ENUM_ROLES_ID.name} {
    ${pascalCase(EXAMPLE_ROLE.displayName)} = "${EXAMPLE_ROLE.name}",
    ${pascalCase(OTHER_EXAMPLE_ROLE.displayName)} = "${OTHER_EXAMPLE_ROLE.name}"
}`;

describe("createEnumRolesModule", () => {
  expect(createEnumRolesModule(EXAMPLE_ROLES)).toEqual({
    path: "admin-ui/src/user/EnumRoles.ts",
    code: `export ${EXPECTED_DECLARATION_CODE}`,
  });
});

describe("createRolesEnumDeclaration", () => {
  test("creates roles enum declaration", () => {
    expect(print(createRolesEnumDeclaration(EXAMPLE_ROLES)).code).toEqual(
      EXPECTED_DECLARATION_CODE
    );
  });
});
