import {
  Entity,
  EntityField,
  EntityPermission,
  EntityPermissionRole,
  Role,
  EnumDataType,
  EnumEntityAction,
  EnumEntityPermissionType,
} from "../types";
import {
  createGrants,
  Grant,
  ALL_ATTRIBUTES_ALLOWED,
  CREATE_ANY,
  createAttributes,
  createNegativeAttributeMatcher,
} from "./create-grants";

type TestCase = Array<[string, Entity[], Role[], Grant[]]>;

const EXAMPLE_ENTITY: Entity = {
  id: "EXAMPLE_ENTITY_ID",
  name: "ExampleEntityName",
  displayName: "Example Entity",
  pluralDisplayName: "Example Entities",
  fields: [],
  permissions: [],
};
const EXAMPLE_APP_ROLE: Role = {
  displayName: "Example App Role Identifier",
  name: "exampleAppRoleId",
};
const EXAMPLE_OTHER_APP_ROLE: Role = {
  displayName: "Other Example App Role Identifier",
  name: "otherExampleAppRoleID",
};
const EXAMPLE_PERMISSION_ROLE: EntityPermissionRole = {
  appRole: EXAMPLE_APP_ROLE,
};
const EXAMPLE_PERMISSION_OTHER_ROLE: EntityPermissionRole = {
  appRole: EXAMPLE_OTHER_APP_ROLE,
};
const EXAMPLE_ALL_ROLES_CREATE_PERMISSION: EntityPermission = {
  action: EnumEntityAction.Create,
  permissionFields: [],
  permissionRoles: [],
  type: EnumEntityPermissionType.AllRoles,
};
const EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION: EntityPermission = {
  ...EXAMPLE_ALL_ROLES_CREATE_PERMISSION,
  type: EnumEntityPermissionType.Granular,
  permissionRoles: [EXAMPLE_PERMISSION_ROLE],
};
const EXAMPLE_FIELD: EntityField = {
  id: "EXAMPLE_FIELD_ID",
  permanentId: "EXAMPLE_PERMANENT_FIELD_ID",
  dataType: EnumDataType.Id,
  displayName: "Example Field",
  name: "exampleField",
  required: true,
  searchable: false,
  properties: {},
  description: "Example Field Description",
};
const EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION_WITH_FIELD: EntityPermission = {
  ...EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION,
  permissionFields: [
    {
      field: EXAMPLE_FIELD,
      permissionRoles: [EXAMPLE_PERMISSION_OTHER_ROLE],
    },
  ],
};
const EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION_WITH_FIELD_WITH_NO_ROLES: EntityPermission = {
  ...EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION,
  permissionFields: [
    {
      field: EXAMPLE_FIELD,
      permissionRoles: null,
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
      "single entity permission with granular role and restricted field",
      [
        {
          ...EXAMPLE_ENTITY,
          permissions: [EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION_WITH_FIELD],
        },
      ],
      EXAMPLE_ROLES,
      [EXAMPLE_ROLE_CREATE_GRANT_WITH_EXCLUDED_FIELD],
    ],
    [
      "single entity permission with granular role and excluded field",
      [
        {
          ...EXAMPLE_ENTITY,
          permissions: [
            EXAMPLE_SINGLE_ROLE_CREATE_PERMISSION_WITH_FIELD_WITH_NO_ROLES,
          ],
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
