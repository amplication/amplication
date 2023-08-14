import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import {
  ApolloDriver,
  ApolloDriverConfig,
  getApolloServer,
} from "@nestjs/apollo";
import { INestApplication } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { Test, TestingModule } from "@nestjs/testing";
import { ApolloServerBase } from "apollo-server-core";
import { gql } from "apollo-server-express";
import { mockGqlAuthGuardCanActivate } from "../../../test/gql-auth-mock";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Commit, EntityPermissionField } from "../../models";
import { Entity } from "../../models/Entity";
import { EntityField } from "../../models/EntityField";
import { EntityPermission } from "../../models/EntityPermission";
import { EntityVersion } from "../../models/EntityVersion";
import { User } from "../../models/User";
import {
  EnumDataType,
  EnumEntityAction,
  EnumEntityPermissionType,
} from "../../prisma";
import { UserService } from "../user/user.service";
import { EntityResolver } from "./entity.resolver";
import { EntityService } from "./entity.service";
import { EntityVersionResolver } from "./entityVersion.resolver";

const EXAMPLE_ID = "exampleId";
const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_ENTITY_FIELD_ID = "exampleEntityFieldId";
const EXAMPLE_PERMISSION_ID = "examplePermissionId";
const EXAMPLE_VERSION_ID = "exampleVersionId";
const EXAMPLE_VERSION_NUMBER = 1;
const EXAMPLE_NAME = "exampleName";
const EXAMPLE_DISPLAY_NAME = "exampleDisplayName";
const EXAMPLE_PLURAL_DISPLAY_NAME = "examplePluralDisplayName";
const EXAMPLE_CUSTOM_ATTRIBUTES = "exampleCustomAttributes";

const EXAMPLE_UNLOCKED_ID = "exampleUnlockedId";

const EXAMPLE_PERMISSION_FIELD_ID = "examplePermissionFieldId";
const EXAMPLE_FIELD_PERMANENT_ID = "exampleFieldPermanentId";

const EXAMPLE_COMMIT_ID = "exampleCommitId";
const EXAMPLE_MESSAGE = "exampleMessage";

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: "exampleResourceId",
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_PLURAL_DISPLAY_NAME,
  customAttributes: EXAMPLE_CUSTOM_ATTRIBUTES,
  lockedByUserId: EXAMPLE_USER_ID,
};

const EXAMPLE_UNLOCKED_ENTITY = {
  ...EXAMPLE_ENTITY,
  id: EXAMPLE_UNLOCKED_ID,
  lockedByUserId: null,
};

const EXAMPLE_ENTITY_FIELD: EntityField = {
  id: EXAMPLE_ENTITY_FIELD_ID,
  permanentId: "examplePermanentId",
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  dataType: EnumDataType.SingleLineText,
  required: false,
  unique: false,
  searchable: true,
  description: "exampleDescription",
  customAttributes: "ExampleCustomAttributes",
  properties: {},
};

const EXAMPLE_ENTITY_FIELD_WITH_RELATION: EntityField = {
  ...EXAMPLE_ENTITY_FIELD,
  properties: {
    relatedFieldId: "exampleRelatedFieldId",
  },
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true,
};

const EXAMPLE_PERMISSION: EntityPermission = {
  id: EXAMPLE_PERMISSION_ID,
  entityVersionId: EXAMPLE_VERSION_ID,
  action: EnumEntityAction.View,
  type: EnumEntityPermissionType.AllRoles,
};

const EXAMPLE_PERMISSION_FIELD: EntityPermissionField = {
  id: EXAMPLE_PERMISSION_FIELD_ID,
  permissionId: EXAMPLE_PERMISSION_ID,
  fieldPermanentId: EXAMPLE_FIELD_PERMANENT_ID,
  entityVersionId: EXAMPLE_VERSION_ID,
  field: EXAMPLE_ENTITY_FIELD,
};

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE,
  createdAt: new Date(),
};

const EXAMPLE_VERSION: EntityVersion = {
  id: EXAMPLE_VERSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: EXAMPLE_ID,
  versionNumber: EXAMPLE_VERSION_NUMBER,
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_PLURAL_DISPLAY_NAME,
  customAttributes: EXAMPLE_CUSTOM_ATTRIBUTES,
  commit: EXAMPLE_COMMIT,
};

const FIND_ONE_QUERY = gql`
  query ($id: String!) {
    entity(where: { id: $id }) {
      id
      createdAt
      updatedAt
      resourceId
      name
      displayName
      pluralDisplayName
      customAttributes
      lockedByUserId
    }
  }
`;

const FIND_MANY_QUERY = gql`
  query ($id: String) {
    entities(where: { id: { equals: $id } }) {
      id
      createdAt
      updatedAt
      resourceId
      name
      displayName
      pluralDisplayName
      customAttributes
      lockedByUserId
    }
  }
`;

const CREATE_ONE_QUERY = gql`
  mutation (
    $name: String!
    $displayName: String!
    $pluralDisplayName: String!
    $customAttributes: String
    $id: String!
  ) {
    createOneEntity(
      data: {
        name: $name
        displayName: $displayName
        pluralDisplayName: $pluralDisplayName
        customAttributes: $customAttributes
        resource: { connect: { id: $id } }
      }
    ) {
      id
      createdAt
      updatedAt
      resourceId
      name
      displayName
      pluralDisplayName
      customAttributes
      lockedByUserId
    }
  }
`;

const FIND_MANY_FIELDS_QUERY = gql`
  query ($entityId: String!, $fieldId: String!) {
    entity(where: { id: $entityId }) {
      fields(where: { id: { equals: $fieldId } }) {
        id
        permanentId
        createdAt
        updatedAt
        name
        displayName
        dataType
        required
        unique
        searchable
        customAttributes
        description
        properties
      }
    }
  }
`;
const FIND_MANY_PERMISSIONS_QUERY = gql`
  query ($entityId: String!) {
    entity(where: { id: $entityId }) {
      permissions {
        id
        entityVersionId
        action
        type
      }
    }
  }
`;

const LOCKED_BY_USER_QUERY = gql`
  query ($id: String!) {
    entity(where: { id: $id }) {
      lockedByUser {
        id
        createdAt
        updatedAt
        isOwner
      }
    }
  }
`;

const LOCK_ENTITY_MUTATION = gql`
  mutation ($id: String!) {
    lockEntity(where: { id: $id }) {
      id
      createdAt
      updatedAt
      resourceId
      name
      displayName
      pluralDisplayName
      customAttributes
      lockedByUserId
    }
  }
`;

const UPDATE_ENTITY_MUTATION = gql`
  mutation ($id: String!) {
    updateEntity(data: {}, where: { id: $id }) {
      id
      createdAt
      updatedAt
      resourceId
      name
      displayName
      pluralDisplayName
      customAttributes
      lockedByUserId
    }
  }
`;

const DELETE_ENTITY_MUTATION = gql`
  mutation ($id: String!) {
    deleteEntity(where: { id: $id }) {
      id
      createdAt
      updatedAt
      resourceId
      name
      displayName
      pluralDisplayName
      customAttributes
      lockedByUserId
    }
  }
`;

const UPDATE_ENTITY_PERM_MUTATUION = gql`
  mutation (
    $action: EnumEntityAction!
    $type: EnumEntityPermissionType!
    $id: String!
  ) {
    updateEntityPermission(
      data: { action: $action, type: $type }
      where: { id: $id }
    ) {
      id
      entityVersionId
      action
      type
    }
  }
`;

const UPDATE_ENTITY_PERM_ROLES_MUTATION = gql`
  mutation ($action: EnumEntityAction!, $entityId: String!) {
    updateEntityPermissionRoles(
      data: { action: $action, entity: { connect: { id: $entityId } } }
    ) {
      id
      entityVersionId
      action
      type
    }
  }
`;

const ADD_ENTITY_PERM_FIELD_MUTATION = gql`
  mutation (
    $action: EnumEntityAction!
    $fieldName: String!
    $entityId: String!
  ) {
    addEntityPermissionField(
      data: {
        action: $action
        fieldName: $fieldName
        entity: { connect: { id: $entityId } }
      }
    ) {
      id
      permissionId
      fieldPermanentId
      entityVersionId
      field {
        id
        permanentId
        createdAt
        updatedAt
        name
        displayName
        dataType
        required
        unique
        searchable
        customAttributes
        description
        properties
      }
    }
  }
`;

const DELETE_ENTITY_PERM_FIELD_MUTATION = gql`
  mutation (
    $action: EnumEntityAction!
    $fieldPermanentId: String!
    $entityId: String!
  ) {
    deleteEntityPermissionField(
      where: {
        action: $action
        fieldPermanentId: $fieldPermanentId
        entityId: $entityId
      }
    ) {
      id
      permissionId
      fieldPermanentId
      entityVersionId
      field {
        id
        permanentId
        createdAt
        updatedAt
        name
        displayName
        dataType
        required
        unique
        searchable
        customAttributes
        description
        properties
      }
    }
  }
`;

const UPDATE_ENTITY_PERM_FIELD_ROLES_MUTATION = gql`
  mutation ($permissionFieldId: String!) {
    updateEntityPermissionFieldRoles(
      data: { permissionField: { connect: { id: $permissionFieldId } } }
    ) {
      id
      permissionId
      fieldPermanentId
      entityVersionId
      field {
        id
        permanentId
        createdAt
        updatedAt
        name
        displayName
        dataType
        required
        unique
        searchable
        customAttributes
        description
        properties
      }
    }
  }
`;

const CREATE_ENTITY_FIELD_MUTATION = gql`
  mutation (
    $name: String!
    $displayName: String!
    $dataType: EnumDataType!
    $properties: JSONObject!
    $required: Boolean!
    $unique: Boolean!
    $searchable: Boolean!
    $customAttributes: String
    $description: String!
    $entity: String!
  ) {
    createEntityField(
      data: {
        name: $name
        displayName: $displayName
        dataType: $dataType
        properties: $properties
        required: $required
        unique: $unique
        searchable: $searchable
        customAttributes: $customAttributes
        description: $description
        entity: { connect: { id: $entity } }
      }
    ) {
      id
      permanentId
      createdAt
      updatedAt
      name
      displayName
      dataType
      required
      unique
      searchable
      customAttributes
      description
      properties
    }
  }
`;

const CREATE_ENTITY_FIELD_BY_DISPLAY_NAME_MUTATION = gql`
  mutation ($displayName: String!, $entityId: String!) {
    createEntityFieldByDisplayName(
      data: {
        displayName: $displayName
        entity: { connect: { id: $entityId } }
      }
    ) {
      id
      permanentId
      createdAt
      updatedAt
      name
      displayName
      dataType
      required
      unique
      searchable
      customAttributes
      description
      properties
    }
  }
`;

const DELETE_ENTITY_FIELD_MUTATION = gql`
  mutation ($fieldId: String!) {
    deleteEntityField(where: { id: $fieldId }) {
      id
      permanentId
      createdAt
      updatedAt
      name
      displayName
      dataType
      required
      unique
      searchable
      customAttributes
      description
      properties
    }
  }
`;

const UPDATE_ENTITY_FIELD_MUTATION = gql`
  mutation ($fieldId: String!) {
    updateEntityField(where: { id: $fieldId }, data: {}) {
      id
      permanentId
      createdAt
      updatedAt
      name
      displayName
      dataType
      required
      unique
      searchable
      customAttributes
      description
      properties
    }
  }
`;

const CREATE_DEFAULT_RELATED_FIELD_MUTATION = gql`
  mutation ($fieldId: String!) {
    createDefaultRelatedField(where: { id: $fieldId }) {
      id
      permanentId
      createdAt
      updatedAt
      name
      displayName
      dataType
      required
      unique
      searchable
      customAttributes
      description
      properties
    }
  }
`;

const GET_VERSION_COMMIT_QUERY = gql`
  query ($entityId: String!) {
    entity(where: { id: $entityId }) {
      versions {
        commit {
          id
          userId
          message
          createdAt
        }
      }
    }
  }
`;

const GET_VERSION_FIELDS_QUERY = gql`
  query ($entityId: String!) {
    entity(where: { id: $entityId }) {
      versions {
        fields {
          id
          permanentId
          createdAt
          updatedAt
          name
          displayName
          dataType
          required
          unique
          searchable
          customAttributes
          description
          properties
        }
      }
    }
  }
`;

const GET_VERSION_PERMISSIONS_QUERY = gql`
  query ($entityId: String!) {
    entity(where: { id: $entityId }) {
      versions {
        permissions {
          id
          entityVersionId
          action
          type
        }
      }
    }
  }
`;

const entityMock = jest.fn(() => EXAMPLE_ENTITY);
const entitiesMock = jest.fn(() => [EXAMPLE_ENTITY]);
const entityCreateOneMock = jest.fn(() => EXAMPLE_ENTITY);
const getEntityFieldsMock = jest.fn(() => [EXAMPLE_ENTITY_FIELD]);
const getPermissionsMock = jest.fn(() => [EXAMPLE_PERMISSION]);
const getVersionsMock = jest.fn(() => [EXAMPLE_VERSION]);
const findUserMock = jest.fn(() => EXAMPLE_USER);
const acquireLockMock = jest.fn(() => EXAMPLE_ENTITY);
const updateOneEntityMock = jest.fn(() => EXAMPLE_ENTITY);
const deleteOneEntityMock = jest.fn(() => EXAMPLE_ENTITY);
const updateEntityPermissionMock = jest.fn(() => EXAMPLE_PERMISSION);
const updateEntityPermissionRolesMock = jest.fn(() => EXAMPLE_PERMISSION);
const addEntityPermissionFieldMock = jest.fn(() => EXAMPLE_PERMISSION_FIELD);
const deleteEntityPermissionFieldMock = jest.fn(() => EXAMPLE_PERMISSION_FIELD);
const updateEntityPermissionFieldRolesMock = jest.fn(
  () => EXAMPLE_PERMISSION_FIELD
);
const createFieldMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);
const createFieldByDisplayNameMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);
const deleteFieldMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);
const updateFieldMock = jest.fn(() => EXAMPLE_ENTITY_FIELD);
const createDefaultRelatedFieldMock = jest.fn(
  () => EXAMPLE_ENTITY_FIELD_WITH_RELATION
);
const entityServiceGetVersionMock = jest.fn(() => EXAMPLE_VERSION);
const entityServiceGetVersionCommitMock = jest.fn(() => EXAMPLE_COMMIT);
const entityServiceGetVersionFieldsMock = jest.fn(() => [EXAMPLE_ENTITY_FIELD]);
const entityServiceGetVersionPermissionsMock = jest.fn(() => [
  EXAMPLE_PERMISSION,
]);

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

describe("EntityResolver", () => {
  let app: INestApplication;
  let apolloClient: ApolloServerBase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        EntityResolver,
        EntityVersionResolver,
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            entity: entityMock,
            entities: entitiesMock,
            createOneEntity: entityCreateOneMock,
            getFields: getEntityFieldsMock,
            getPermissions: getPermissionsMock,
            getVersions: getVersionsMock,
            acquireLock: acquireLockMock,
            updateOneEntity: updateOneEntityMock,
            deleteOneEntity: deleteOneEntityMock,
            updateEntityPermission: updateEntityPermissionMock,
            updateEntityPermissionRoles: updateEntityPermissionRolesMock,
            addEntityPermissionField: addEntityPermissionFieldMock,
            deleteEntityPermissionField: deleteEntityPermissionFieldMock,
            updateEntityPermissionFieldRoles:
              updateEntityPermissionFieldRolesMock,
            createField: createFieldMock,
            createFieldByDisplayName: createFieldByDisplayNameMock,
            deleteField: deleteFieldMock,
            updateField: updateFieldMock,
            createDefaultRelatedField: createDefaultRelatedFieldMock,
            getVersion: entityServiceGetVersionMock,
            getVersionCommit: entityServiceGetVersionCommitMock,
            getVersionFields: entityServiceGetVersionFieldsMock,
            getVersionPermissions: entityServiceGetVersionPermissionsMock,
          })),
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUser: findUserMock,
          })),
        },
        {
          provide: AmplicationLogger,
          useClass: jest.fn(() => ({
            error: jest.fn(),
          })),
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: jest.fn(),
          })),
        },
      ],
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          autoSchemaFile: true,
          driver: ApolloDriver,
        }),
      ],
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({ canActivate: mockCanActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    apolloClient = getApolloServer(app);
  });

  it("should find one entity", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_ONE_QUERY,
      variables: { id: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        ...EXAMPLE_ENTITY,
        createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
      },
    });
    expect(entityMock).toBeCalledTimes(1);
    expect(entityMock).toBeCalledWith({ where: { id: EXAMPLE_ID } });
  });

  it("should find many entities", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_MANY_QUERY,
      variables: { id: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entities: [
        {
          ...EXAMPLE_ENTITY,
          createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
          updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
        },
      ],
    });
    expect(entitiesMock).toBeCalledTimes(1);
    expect(entitiesMock).toBeCalledWith({
      where: { id: { equals: EXAMPLE_ID } },
    });
  });

  it("should create one entity", async () => {
    const res = await apolloClient.executeOperation({
      query: CREATE_ONE_QUERY,
      variables: {
        name: EXAMPLE_ENTITY.name,
        displayName: EXAMPLE_ENTITY.displayName,
        pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
        customAttributes: EXAMPLE_ENTITY.customAttributes,
        id: EXAMPLE_ID,
      },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createOneEntity: {
        ...EXAMPLE_ENTITY,
        createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
      },
    });
    expect(entityCreateOneMock).toBeCalledTimes(1);
    expect(entityCreateOneMock).toBeCalledWith(
      {
        data: {
          name: EXAMPLE_ENTITY.name,
          displayName: EXAMPLE_ENTITY.displayName,
          pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
          customAttributes: EXAMPLE_ENTITY.customAttributes,
          resource: { connect: { id: EXAMPLE_ID } },
        },
      },
      EXAMPLE_USER
    );
  });

  it("should get entity fields", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_MANY_FIELDS_QUERY,
      variables: { entityId: EXAMPLE_ID, fieldId: EXAMPLE_ENTITY_FIELD_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        fields: [
          {
            ...EXAMPLE_ENTITY_FIELD,
            createdAt: EXAMPLE_ENTITY_FIELD.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY_FIELD.updatedAt.toISOString(),
          },
        ],
      },
    });
    expect(getEntityFieldsMock).toBeCalledTimes(1);
    expect(getEntityFieldsMock).toBeCalledWith(EXAMPLE_ID, {
      where: { id: { equals: EXAMPLE_ENTITY_FIELD_ID } },
    });
  });

  it("should get entity permissions", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_MANY_PERMISSIONS_QUERY,
      variables: { entityId: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        permissions: [
          {
            ...EXAMPLE_PERMISSION,
          },
        ],
      },
    });
    expect(getPermissionsMock).toBeCalledTimes(1);
    expect(getPermissionsMock).toBeCalledWith(EXAMPLE_ID);
  });

  it("should return locking user", async () => {
    const res = await apolloClient.executeOperation({
      query: LOCKED_BY_USER_QUERY,
      variables: { id: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        lockedByUser: {
          ...EXAMPLE_USER,
          createdAt: EXAMPLE_USER.createdAt.toISOString(),
          updatedAt: EXAMPLE_USER.updatedAt.toISOString(),
          isOwner: true,
        },
      },
    });
    expect(findUserMock).toBeCalledTimes(1);
    expect(findUserMock).toBeCalledWith({ where: { id: EXAMPLE_USER_ID } });
  });

  it("should return null when no locking user", async () => {
    entityMock.mockImplementationOnce(() => EXAMPLE_UNLOCKED_ENTITY);

    const res = await apolloClient.executeOperation({
      query: LOCKED_BY_USER_QUERY,
      variables: { id: EXAMPLE_UNLOCKED_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        lockedByUser: null,
      },
    });
    expect(findUserMock).toBeCalledTimes(0);
  });

  it("should lock an entity", async () => {
    const res = await apolloClient.executeOperation({
      query: LOCK_ENTITY_MUTATION,
      variables: { id: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      lockEntity: {
        ...EXAMPLE_ENTITY,
        createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
      },
    });
    expect(acquireLockMock).toBeCalledTimes(1);
    expect(acquireLockMock).toBeCalledWith(
      { where: { id: EXAMPLE_ID } },
      EXAMPLE_USER
    );
  });

  it("should update one entity", async () => {
    const res = await apolloClient.executeOperation({
      query: UPDATE_ENTITY_MUTATION,
      variables: { id: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateEntity: {
        ...EXAMPLE_ENTITY,
        createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
      },
    });
    expect(updateOneEntityMock).toBeCalledTimes(1);
    expect(updateOneEntityMock).toBeCalledWith(
      {
        data: {},
        where: { id: EXAMPLE_ID },
      },
      EXAMPLE_USER
    );
  });

  it("should delete one entity", async () => {
    const res = await apolloClient.executeOperation({
      query: DELETE_ENTITY_MUTATION,
      variables: { id: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      deleteEntity: {
        ...EXAMPLE_ENTITY,
        createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
      },
    });
    expect(deleteOneEntityMock).toBeCalledTimes(1);
    expect(deleteOneEntityMock).toBeCalledWith(
      { where: { id: EXAMPLE_ID } },
      EXAMPLE_USER
    );
  });

  it("should update an entity permission", async () => {
    const res = await apolloClient.executeOperation({
      query: UPDATE_ENTITY_PERM_MUTATUION,
      variables: {
        action: EXAMPLE_PERMISSION.action,
        type: EXAMPLE_PERMISSION.type,
        id: EXAMPLE_PERMISSION_ID,
      },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateEntityPermission: {
        ...EXAMPLE_PERMISSION,
      },
    });
    expect(updateEntityPermissionMock).toBeCalledTimes(1);
    expect(updateEntityPermissionMock).toBeCalledWith(
      {
        data: {
          action: EXAMPLE_PERMISSION.action,
          type: EXAMPLE_PERMISSION.type,
        },
        where: { id: EXAMPLE_PERMISSION_ID },
      },
      EXAMPLE_USER
    );
  });

  it("should update entity permission roles", async () => {
    const res = await apolloClient.executeOperation({
      query: UPDATE_ENTITY_PERM_ROLES_MUTATION,
      variables: { action: EXAMPLE_PERMISSION.action, entityId: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateEntityPermissionRoles: {
        ...EXAMPLE_PERMISSION,
      },
    });
    expect(updateEntityPermissionRolesMock).toBeCalledTimes(1);
    expect(updateEntityPermissionRolesMock).toBeCalledWith(
      {
        data: {
          action: EXAMPLE_PERMISSION.action,
          entity: { connect: { id: EXAMPLE_ID } },
        },
      },
      EXAMPLE_USER
    );
  });

  it("should add an entity permission field", async () => {
    const res = await apolloClient.executeOperation({
      query: ADD_ENTITY_PERM_FIELD_MUTATION,
      variables: {
        action: EXAMPLE_PERMISSION.action,
        fieldName: EXAMPLE_NAME,
        entityId: EXAMPLE_ID,
      },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      addEntityPermissionField: {
        ...EXAMPLE_PERMISSION_FIELD,
        field: {
          ...EXAMPLE_ENTITY_FIELD,
          createdAt: EXAMPLE_ENTITY_FIELD.createdAt.toISOString(),
          updatedAt: EXAMPLE_ENTITY_FIELD.updatedAt.toISOString(),
        },
      },
    });
    expect(addEntityPermissionFieldMock).toBeCalledTimes(1);
    expect(addEntityPermissionFieldMock).toBeCalledWith(
      {
        data: {
          action: EXAMPLE_PERMISSION.action,
          fieldName: EXAMPLE_NAME,
          entity: { connect: { id: EXAMPLE_ID } },
        },
      },
      EXAMPLE_USER
    );
  });

  it("should delete an entity permission field", async () => {
    const res = await apolloClient.executeOperation({
      query: DELETE_ENTITY_PERM_FIELD_MUTATION,
      variables: {
        action: EXAMPLE_PERMISSION.action,
        fieldPermanentId: EXAMPLE_FIELD_PERMANENT_ID,
        entityId: EXAMPLE_ID,
      },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      deleteEntityPermissionField: {
        ...EXAMPLE_PERMISSION_FIELD,
        field: {
          ...EXAMPLE_ENTITY_FIELD,
          createdAt: EXAMPLE_ENTITY_FIELD.createdAt.toISOString(),
          updatedAt: EXAMPLE_ENTITY_FIELD.updatedAt.toISOString(),
        },
      },
    });
    expect(deleteEntityPermissionFieldMock).toBeCalledTimes(1);
    expect(deleteEntityPermissionFieldMock).toBeCalledWith(
      {
        where: {
          action: EXAMPLE_PERMISSION.action,
          fieldPermanentId: EXAMPLE_FIELD_PERMANENT_ID,
          entityId: EXAMPLE_ID,
        },
      },
      EXAMPLE_USER
    );
  });

  it("should update entity permission field roles", async () => {
    const res = await apolloClient.executeOperation({
      query: UPDATE_ENTITY_PERM_FIELD_ROLES_MUTATION,
      variables: { permissionFieldId: EXAMPLE_PERMISSION_FIELD_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateEntityPermissionFieldRoles: {
        ...EXAMPLE_PERMISSION_FIELD,
        field: {
          ...EXAMPLE_ENTITY_FIELD,
          createdAt: EXAMPLE_ENTITY_FIELD.createdAt.toISOString(),
          updatedAt: EXAMPLE_ENTITY_FIELD.updatedAt.toISOString(),
        },
      },
    });
    expect(updateEntityPermissionFieldRolesMock).toBeCalledTimes(1);
    expect(updateEntityPermissionFieldRolesMock).toBeCalledWith(
      {
        data: {
          permissionField: { connect: { id: EXAMPLE_PERMISSION_FIELD_ID } },
        },
      },
      EXAMPLE_USER
    );
  });

  it("should create an entity field", async () => {
    const variables = {
      name: EXAMPLE_NAME,
      displayName: EXAMPLE_DISPLAY_NAME,
      dataType: EXAMPLE_ENTITY_FIELD.dataType,
      properties: EXAMPLE_ENTITY_FIELD.properties,
      required: EXAMPLE_ENTITY_FIELD.required,
      unique: EXAMPLE_ENTITY_FIELD.unique,
      searchable: EXAMPLE_ENTITY_FIELD.searchable,
      customAttributes: EXAMPLE_ENTITY_FIELD.customAttributes,
      description: EXAMPLE_ENTITY_FIELD.description,
      entity: EXAMPLE_ID,
    };
    const res = await apolloClient.executeOperation({
      query: CREATE_ENTITY_FIELD_MUTATION,
      variables: variables,
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createEntityField: {
        ...EXAMPLE_ENTITY_FIELD,
        createdAt: EXAMPLE_ENTITY_FIELD.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY_FIELD.updatedAt.toISOString(),
      },
    });
    expect(createFieldMock).toBeCalledTimes(1);
    expect(createFieldMock).toBeCalledWith(
      { data: { ...variables, entity: { connect: { id: EXAMPLE_ID } } } },
      EXAMPLE_USER,
      null,
      true,
      true
    );
  });

  it("should create entity field by display name", async () => {
    const res = await apolloClient.executeOperation({
      query: CREATE_ENTITY_FIELD_BY_DISPLAY_NAME_MUTATION,
      variables: { displayName: EXAMPLE_DISPLAY_NAME, entityId: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createEntityFieldByDisplayName: {
        ...EXAMPLE_ENTITY_FIELD,
        createdAt: EXAMPLE_ENTITY_FIELD.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY_FIELD.updatedAt.toISOString(),
      },
    });
    expect(createFieldByDisplayNameMock).toBeCalledTimes(1);
    expect(createFieldByDisplayNameMock).toBeCalledWith(
      {
        data: {
          displayName: EXAMPLE_DISPLAY_NAME,
          entity: { connect: { id: EXAMPLE_ID } },
        },
      },
      EXAMPLE_USER,
      true
    );
  });

  it("should delete an entity field", async () => {
    const res = await apolloClient.executeOperation({
      query: DELETE_ENTITY_FIELD_MUTATION,
      variables: { fieldId: EXAMPLE_ENTITY_FIELD_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      deleteEntityField: {
        ...EXAMPLE_ENTITY_FIELD,
        createdAt: EXAMPLE_ENTITY_FIELD.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY_FIELD.updatedAt.toISOString(),
      },
    });
    expect(deleteFieldMock).toBeCalledTimes(1);
    expect(deleteFieldMock).toBeCalledWith(
      { where: { id: EXAMPLE_ENTITY_FIELD_ID } },
      EXAMPLE_USER
    );
  });

  it("should update an entity field", async () => {
    const res = await apolloClient.executeOperation({
      query: UPDATE_ENTITY_FIELD_MUTATION,
      variables: { fieldId: EXAMPLE_ENTITY_FIELD_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateEntityField: {
        ...EXAMPLE_ENTITY_FIELD,
        createdAt: EXAMPLE_ENTITY_FIELD.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY_FIELD.updatedAt.toISOString(),
      },
    });
    expect(updateFieldMock).toBeCalledTimes(1);
    expect(updateFieldMock).toBeCalledWith(
      { data: {}, where: { id: EXAMPLE_ENTITY_FIELD_ID } },
      EXAMPLE_USER
    );
  });

  it("should create a default related field", async () => {
    const res = await apolloClient.executeOperation({
      query: CREATE_DEFAULT_RELATED_FIELD_MUTATION,
      variables: { fieldId: EXAMPLE_ENTITY_FIELD_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createDefaultRelatedField: {
        ...EXAMPLE_ENTITY_FIELD_WITH_RELATION,
        createdAt: EXAMPLE_ENTITY_FIELD.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY_FIELD.updatedAt.toISOString(),
      },
    });
    expect(createDefaultRelatedFieldMock).toBeCalledTimes(1);
    expect(createDefaultRelatedFieldMock).toBeCalledWith(
      { where: { id: EXAMPLE_ENTITY_FIELD_ID } },
      EXAMPLE_USER
    );
  });

  //EntityVersion Resolver tests:

  it("should get a versions commit", async () => {
    const res = await apolloClient.executeOperation({
      query: GET_VERSION_COMMIT_QUERY,
      variables: { entityId: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        versions: [
          {
            commit: {
              ...EXAMPLE_COMMIT,
              createdAt: EXAMPLE_COMMIT.createdAt.toISOString(),
            },
          },
        ],
      },
    });
    expect(entityServiceGetVersionCommitMock).toBeCalledTimes(1);
    expect(entityServiceGetVersionCommitMock).toBeCalledWith(
      EXAMPLE_VERSION_ID
    );
  });

  it("should get entity version fields", async () => {
    const res = await apolloClient.executeOperation({
      query: GET_VERSION_FIELDS_QUERY,
      variables: { entityId: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        versions: [
          {
            fields: [
              {
                ...EXAMPLE_ENTITY_FIELD,
                createdAt: EXAMPLE_ENTITY_FIELD.createdAt.toISOString(),
                updatedAt: EXAMPLE_ENTITY_FIELD.updatedAt.toISOString(),
              },
            ],
          },
        ],
      },
    });
    expect(entityServiceGetVersionFieldsMock).toBeCalledTimes(1);
    expect(entityServiceGetVersionFieldsMock).toBeCalledWith(
      EXAMPLE_ID,
      EXAMPLE_VERSION_NUMBER,
      {}
    );
  });

  it("should get entity version permissions", async () => {
    const res = await apolloClient.executeOperation({
      query: GET_VERSION_PERMISSIONS_QUERY,
      variables: { entityId: EXAMPLE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        versions: [
          {
            permissions: [
              {
                ...EXAMPLE_PERMISSION,
              },
            ],
          },
        ],
      },
    });
    expect(entityServiceGetVersionPermissionsMock).toBeCalledTimes(1);
    expect(entityServiceGetVersionPermissionsMock).toBeCalledWith(
      EXAMPLE_ID,
      EXAMPLE_VERSION_NUMBER
    );
  });
});
