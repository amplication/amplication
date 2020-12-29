import { pascalCase } from "pascal-case";
import { print } from "recast";
import { Role } from "../types";
import {
  createEnumRolesModule,
  createRolesEnumDeclaration,
  ENUM_ROLES_ID,
  MODULE_PATH,
} from "./create-enum-roles";

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
    path: MODULE_PATH,
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
