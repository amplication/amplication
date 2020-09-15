import * as models from "./models";
import {
  FullEntity,
  FullEntityField,
  FullPermission,
  FullPermissionRole,
} from "./types";
import {
  createGrants,
  Grant,
  ALL_ATTRIBUTES_ALLOWED,
  CREATE_ANY,
  createAttributes,
  createNegativeAttributeMatcher,
} from "./create-grants";
import { EnumEntityAction, EnumEntityPermissionType } from "./models";

type TestCase = Array<[string, FullEntity[], models.AppRole[], Grant[]]>;

const EXAMPLE_ENTITY_ID = "EXAMPLE_ENTITY_ID";
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
const EXAMPLE_OTHER_APP_ROLE: models.AppRole = {
  id: "EXAMPLE_OTHER_APP_ROLE_ID",
  updatedAt: new Date(),
  createdAt: new Date(),
  displayName: "Other Example App Role Identifier",
  name: "otherExampleAppRoleID",
};
const EXAMPLE_PERMISSION_ROLE: FullPermissionRole = {
  appRole: EXAMPLE_APP_ROLE,
};
const EXAMPLE_PERMISSION_OTHER_ROLE: FullPermissionRole = {
  appRole: EXAMPLE_OTHER_APP_ROLE,
};
const EXAMPLE_ALL_ROLES_CREATE_PERMISSION: FullPermission = {
  action: EnumEntityAction.Create,
  permissionFields: [],
  permissionRoles: [],
  type: EnumEntityPermissionType.AllRoles,
};
const EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION: FullPermission = {
  ...EXAMPLE_ALL_ROLES_CREATE_PERMISSION,
  type: EnumEntityPermissionType.Granular,
  permissionRoles: [EXAMPLE_PERMISSION_ROLE],
};
const EXAMPLE_FIELD: FullEntityField = {
  dataType: models.EnumDataType.Id,
  displayName: "Example Field",
  name: "exampleField",
  required: true,
  searchable: false,
  properties: {},
  description: "Example Field Description",
};
const EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION_WITH_FIELD: FullPermission = {
  ...EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION,
  permissionFields: [
    {
      field: EXAMPLE_FIELD,
      permissionFieldRoles: [EXAMPLE_PERMISSION_OTHER_ROLE],
    },
  ],
};
const EXAMPLE_ROLE_CREATE_GRANT: Grant = {
  action: CREATE_ANY,
  attributes: ALL_ATTRIBUTES_ALLOWED,
  resource: EXAMPLE_ENTITY.name,
  role: EXAMPLE_APP_ROLE.name,
};
const EXAMPLE_ROLE_CREATE_GRANT_WITH_EXCLUDED_FIELD: Grant = {
  action: CREATE_ANY,
  attributes: createAttributes([
    ALL_ATTRIBUTES_ALLOWED,
    createNegativeAttributeMatcher(EXAMPLE_FIELD.name),
  ]),
  resource: EXAMPLE_ENTITY.name,
  role: EXAMPLE_APP_ROLE.name,
};
const EXAMPLE_OTHER_ROLE_CREATE_GRANT: Grant = {
  action: CREATE_ANY,
  attributes: ALL_ATTRIBUTES_ALLOWED,
  resource: EXAMPLE_ENTITY.name,
  role: EXAMPLE_OTHER_APP_ROLE.name,
};
const EXAMPLE_ROLES = [EXAMPLE_APP_ROLE, EXAMPLE_OTHER_APP_ROLE];

describe("createGrants", () => {
  const cases: TestCase = [
    [
      "single entity permission for all roles",
      [
        {
          ...EXAMPLE_ENTITY,
          permissions: [EXAMPLE_ALL_ROLES_CREATE_PERMISSION],
        },
      ],
      EXAMPLE_ROLES,
      [EXAMPLE_ROLE_CREATE_GRANT, EXAMPLE_OTHER_ROLE_CREATE_GRANT],
    ],
    [
      "single entity permission with granular role",
      [
        {
          ...EXAMPLE_ENTITY,
          permissions: [EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION],
        },
      ],
      EXAMPLE_ROLES,
      [EXAMPLE_ROLE_CREATE_GRANT],
    ],
    [
      "single entity permission with granular role and excluded field",
      [
        {
          ...EXAMPLE_ENTITY,
          permissions: [EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION_WITH_FIELD],
        },
      ],
      EXAMPLE_ROLES,
      [EXAMPLE_ROLE_CREATE_GRANT_WITH_EXCLUDED_FIELD],
    ],
  ];
  test.each(cases)("%s", (name, entities, roles, grants) => {
    expect(createGrants(entities, roles)).toEqual(grants);
  });
});
