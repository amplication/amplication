import * as models from "./models";
import { FullEntity } from "./types";
import {
  createGrants,
  Grant,
  ALL_ATTRIBUTES,
  CREATE_ANY,
} from "./create-grants";
import { EnumEntityAction, EnumEntityPermissionType } from "./models";

type TestCase = Array<[string, FullEntity[], models.AppRole[], Grant[]]>;

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
const EXAMPLE_ENTITY_PERMISSION_ID = "EXAMPLE_ENTITY_PERMISSION_ID";
const EXAMPLE_ENTITY_VERSION_ID = "EXAMPLE_ENTITY_VERSION_ID";
const EXAMPLE_APP_ID = "EXAMPLE_APP_ID";
const EXAMPLE_ENTITY = {
  id: EXAMPLE_ENTITY_ID,
  name: "ExampleEntityName",
  appId: EXAMPLE_APP_ID,
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  createdAt: new Date(),
  updatedAt: new Date(),
  fields: [],
  permissions: [],
};
const EXAMPLE_APP_ROLE: models.AppRole = {
  id: "EXAMPLE_APP_ROLE_ID",
  updatedAt: new Date(),
  createdAt: new Date(),
  displayName: "Example App Role Identifier",
  name: "exampleAppRoleId",
};
const OTHER_EXAMPLE_APP_ROLE: models.AppRole = {
  id: "OTHER_EXAMPLE_APP_ROLE_ID",
  updatedAt: new Date(),
  createdAt: new Date(),
  displayName: "Other Example App Role Identifier",
  name: "otherExampleAppRoleID",
};
const EXAMPLE_PERMISSION_ROLE = {
  id: "EXAMPLE_PERMISSION_ROLE_ID",
  action: EnumEntityAction.Create,
  entityVersionId: EXAMPLE_ENTITY_VERSION_ID,
  appRoleId: EXAMPLE_APP_ROLE.id,
  appRole: EXAMPLE_APP_ROLE,
};

describe("createGrants", () => {
  const cases: TestCase = [
    [
      "single entity permission for all roles",
      [
        {
          ...EXAMPLE_ENTITY,
          permissions: [
            {
              id: EXAMPLE_ENTITY_PERMISSION_ID,
              action: EnumEntityAction.Create,
              permissionFields: [],
              permissionRoles: [],
              type: EnumEntityPermissionType.AllRoles,
              entityVersionId: EXAMPLE_ENTITY_VERSION_ID,
            },
          ],
        },
      ],
      [EXAMPLE_APP_ROLE, OTHER_EXAMPLE_APP_ROLE],
      [
        {
          action: CREATE_ANY,
          attributes: ALL_ATTRIBUTES,
          resource: EXAMPLE_ENTITY.name,
          role: EXAMPLE_APP_ROLE.name,
        },
        {
          action: CREATE_ANY,
          attributes: ALL_ATTRIBUTES,
          resource: EXAMPLE_ENTITY.name,
          role: OTHER_EXAMPLE_APP_ROLE.name,
        },
      ],
    ],
  ];
  test.each(cases)("%s", (name, entities, roles, grants) => {
    expect(createGrants(entities, roles)).toEqual(grants);
  });
});
