import { Test, TestingModule } from '@nestjs/testing';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { EntityResolver } from './entity.resolver';
import { EntityService } from './entity.service';
import { INestApplication } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { GraphQLModule } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { Entity } from 'src/models/Entity';
import { User } from 'src/models/User';
import { EntityField } from 'src/models/EntityField';
import {
  EnumDataType,
  EnumEntityAction,
  EnumEntityPermissionType
} from '@prisma/client';
import { EntityPermission } from 'src/models/EntityPermission';
import { EntityVersion } from 'src/models/EntityVersion';

const EXAMPLE_ID = 'exampleId';
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_ENTITY_FIELD_ID = 'exampleEntityFieldId';
const EXAMPLE_PERMISSION_ID = 'examplePermissionId';
const EXAMPLE_VERSION_ID = 'exampleVersionId';
const EXAMPLE_VERSION_NUMBER = 1;
const EXAMPLE_NAME = 'exampleName';
const EXAMPLE_DISPLAY_NAME = 'exampleDisplayName';
const EXAMPLE_PLURAL_DISPLAY_NAME = 'examplePluralDisplayName';

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ID,
  createdAt: new Date('2020-10-14T07:33:35.549Z'),
  updatedAt: new Date('2020-10-14T07:33:35.549Z'),
  appId: 'exampleAppId',
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_PLURAL_DISPLAY_NAME,
  lockedByUserId: EXAMPLE_USER_ID
};

const EXAMPLE_ENTITY_FIELD: EntityField = {
  id: EXAMPLE_ENTITY_FIELD_ID,
  permanentId: 'examplePermanentId',
<<<<<<< HEAD
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
=======
  createdAt: new Date('2020-10-14T07:33:35.549Z'),
  updatedAt: new Date('2020-10-14T07:33:35.549Z'),
  name: 'exampleName',
  displayName: 'exampleDisplayName',
>>>>>>> origin/master
  dataType: EnumDataType.SingleLineText,
  required: false,
  searchable: true,
  description: 'exampleDescription',
  properties: {}
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date('2020-10-14T07:33:35.549Z'),
  updatedAt: new Date('2020-10-14T07:33:35.549Z')
};

const EXAMPLE_PERMISSION: EntityPermission = {
  id: EXAMPLE_PERMISSION_ID,
  entityVersionId: EXAMPLE_VERSION_ID,
  action: EnumEntityAction.View,
  type: EnumEntityPermissionType.AllRoles
};

const EXAMPLE_VERSION: EntityVersion = {
  id: EXAMPLE_VERSION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  entityId: EXAMPLE_ID,
  versionNumber: EXAMPLE_VERSION_NUMBER,
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_PLURAL_DISPLAY_NAME
};

const FIND_ONE_QUERY = gql`
  query($id: String!) {
    entity(where: { id: $id }) {
      id
      createdAt
      updatedAt
      appId
      name
      displayName
      pluralDisplayName
      lockedByUserId
    }
  }
`;

const FIND_MANY_QUERY = gql`
  query($id: String) {
    entities(where: { id: { equals: $id } }) {
      id
      createdAt
      updatedAt
      appId
      name
      displayName
      pluralDisplayName
      lockedByUserId
    }
  }
`;

const CREATE_ONE_QUERY = gql`
  mutation(
    $name: String!
    $displayName: String!
    $pluralDisplayName: String!
    $id: String!
  ) {
    createOneEntity(
      data: {
        name: $name
        displayName: $displayName
        pluralDisplayName: $pluralDisplayName
        app: { connect: { id: $id } }
      }
    ) {
      id
      createdAt
      updatedAt
      appId
      name
      displayName
      pluralDisplayName
    }
  }
`;

const FIND_MANY_FIELDS_QUERY = gql`
  query($entityId: String!, $fieldId: String!) {
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
        searchable
        description
        properties
      }
    }
  }
`;
const FIND_MANY_PERMISSIONS_QUERY = gql`
  query($entityId: String!) {
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

const entityMock = jest.fn(() => EXAMPLE_ENTITY);
const entitiesMock = jest.fn(() => [EXAMPLE_ENTITY]);
const entityCreateOneMock = jest.fn(() => EXAMPLE_ENTITY);
const getEntityFieldsMock = jest.fn(() => [EXAMPLE_ENTITY_FIELD]);
const getPermissionsMock = jest.fn(() => [EXAMPLE_PERMISSION]);
const getVersionsMock = jest.fn(() => [EXAMPLE_VERSION]);
const findUserMock = jest.fn(() => EXAMPLE_USER);

const mockCanActivate = jest.fn(() => true);

describe('EntityResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        EntityResolver,
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            entity: entityMock,
            entities: entitiesMock,
            createOneEntity: entityCreateOneMock,
            getEntityFields: getEntityFieldsMock,
            getPermissions: getPermissionsMock,
            getVersions: getVersionsMock
          }))
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUser: findUserMock
          }))
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useClass: jest.fn(() => ({
            error: jest.fn()
          }))
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: jest.fn()
          }))
        }
      ],
      imports: [GraphQLModule.forRoot({ autoSchemaFile: true })]
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({ canActivate: mockCanActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const graphqlModule = moduleFixture.get(GraphQLModule) as any;
    apolloClient = createTestClient(graphqlModule.apolloServer);
  });

  it('should find one entity', async () => {
    const res = await apolloClient.query({
      query: FIND_ONE_QUERY,
      variables: { id: EXAMPLE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        ...EXAMPLE_ENTITY,
        createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
      }
    });
  });

  it('should find many entites', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_QUERY,
      variables: { id: EXAMPLE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entities: [
        {
          ...EXAMPLE_ENTITY,
          createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
          updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
        }
      ]
    });
  });

  it.skip('should create one entity', async () => {
    const res = await apolloClient.query({
      query: CREATE_ONE_QUERY,
      variables: {
        name: EXAMPLE_ENTITY.name,
        displayName: EXAMPLE_ENTITY.displayName,
        pluralDisplayName: EXAMPLE_ENTITY.pluralDisplayName,
        id: EXAMPLE_ID
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createOneEntity: {
        ...EXAMPLE_ENTITY,
        createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
        updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
      }
    });
  });

  it('should get entity fields', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_FIELDS_QUERY,
      variables: { entityId: EXAMPLE_ID, fieldId: EXAMPLE_ENTITY_FIELD_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        fields: [
          {
            ...EXAMPLE_ENTITY_FIELD,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
          }
        ]
      }
    });
  });

  it('should get entity permissions', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_PERMISSIONS_QUERY,
      variables: { entityId: EXAMPLE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      entity: {
        permissions: [
          {
            ...EXAMPLE_PERMISSION
          }
        ]
      }
    });
  });
});

/**
@todo: 
-lockedByUser
-lockEntity
-updateEntity
-deleteEntity
-createOneEntity
-updateEntityPermission
-updateEntityPermissionRoles
-addEntityPermissionField
-deleteEntityPermissionField
-updateEntityPermissionFieldRoles
-createEntityField
-createEntityFieldByDisplayName
-deleteEntityField
-updateEntityField
 */
