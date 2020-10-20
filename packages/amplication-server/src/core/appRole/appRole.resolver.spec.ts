import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { AppRoleService } from './appRole.service';
import { AppRoleResolver } from './appRole.resolver';
import { AppRole } from 'src/models';

const EXAMPLE_APP_ROLE_ID = 'EXAMPLE_APP_ROLE_ID';
const EXAMPLE_NAME = 'EXAMPLE_NAME';
const EXAMPLE_DISPLAY_NAME = 'EXAMPLE_DISPLAY_NAME';
const EXAMPLE_DESCRIPTION = 'exampleDescription';

const EXAMPLE_APP_ID = 'exampleAppId';

const EXAMPLE_VERSION = 1;

const EXAMPLE_APP_ROLE: AppRole = {
  id: EXAMPLE_APP_ROLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME
};

const GET_APP_ROLE_QUERY = gql`
  query($id: String!, $version: Float!) {
    appRole(where: { id: $id }, version: $version) {
      id
      createdAt
      updatedAt
      name
      displayName
    }
  }
`;

const GET_APP_ROLES_QUERY = gql`
  query {
    appRoles {
      id
      createdAt
      updatedAt
      name
      displayName
    }
  }
`;

const CREATE_APP_ROLE_MUTATION = gql`
  mutation(
    $name: String!
    $description: String!
    $displayName: String!
    $appId: String!
  ) {
    createAppRole(
      data: {
        name: $name
        description: $description
        displayName: $displayName
        app: { connect: { id: $appId } }
      }
    ) {
      id
      createdAt
      updatedAt
      name
      displayName
    }
  }
`;

const DELETE_APP_ROLE_MUTATION = gql`
  mutation($id: String!) {
    deleteAppRole(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      displayName
    }
  }
`;

const UPDATE_APP_ROLE_MUTATION = gql`
  mutation($id: String!, $displayName: String!) {
    updateAppRole(where: { id: $id }, data: { displayName: $displayName }) {
      id
      createdAt
      updatedAt
      name
      displayName
    }
  }
`;

const getAppRoleMock = jest.fn(() => {
  return EXAMPLE_APP_ROLE;
});
const getAppRolesMock = jest.fn(() => {
  return [EXAMPLE_APP_ROLE];
});
const createAppRoleMock = jest.fn(() => {
  return EXAMPLE_APP_ROLE;
});
const deleteAppRoleMock = jest.fn(() => {
  return EXAMPLE_APP_ROLE;
});
const updateAppRoleMock = jest.fn(() => {
  return EXAMPLE_APP_ROLE;
});

const mockCanActivate = jest.fn(() => true);

describe('AppRoleResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AppRoleResolver,
        {
          provide: AppRoleService,
          useClass: jest.fn(() => ({
            getAppRole: getAppRoleMock,
            getAppRoles: getAppRolesMock,
            createAppRole: createAppRoleMock,
            deleteAppRole: deleteAppRoleMock,
            updateAppRole: updateAppRoleMock
          }))
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useClass: jest.fn(() => ({
            error: jest.fn()
          }))
        },

        {
          provide: PrismaService,
          useClass: jest.fn(() => ({}))
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

  it('should get one AppRole', async () => {
    const res = await apolloClient.query({
      query: GET_APP_ROLE_QUERY,
      variables: { id: EXAMPLE_APP_ROLE_ID, version: EXAMPLE_VERSION }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      appRole: {
        ...EXAMPLE_APP_ROLE,
        createdAt: EXAMPLE_APP_ROLE.createdAt.toISOString(),
        updatedAt: EXAMPLE_APP_ROLE.updatedAt.toISOString()
      }
    });
    expect(getAppRoleMock).toBeCalledTimes(1);
    expect(getAppRoleMock).toBeCalledWith({
      where: { id: EXAMPLE_APP_ROLE_ID },
      version: EXAMPLE_VERSION
    });
  });

  it('should get Many AppRoles', async () => {
    const res = await apolloClient.query({
      query: GET_APP_ROLES_QUERY
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      appRoles: [
        {
          ...EXAMPLE_APP_ROLE,
          createdAt: EXAMPLE_APP_ROLE.createdAt.toISOString(),
          updatedAt: EXAMPLE_APP_ROLE.updatedAt.toISOString()
        }
      ]
    });
    expect(getAppRolesMock).toBeCalledTimes(1);
    expect(getAppRolesMock).toBeCalledWith({});
  });

  it('should create an AppRole', async () => {
    const res = await apolloClient.query({
      query: CREATE_APP_ROLE_MUTATION,
      variables: {
        name: EXAMPLE_NAME,
        description: EXAMPLE_DESCRIPTION,
        displayName: EXAMPLE_DISPLAY_NAME,
        appId: EXAMPLE_APP_ID
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createAppRole: {
        ...EXAMPLE_APP_ROLE,
        createdAt: EXAMPLE_APP_ROLE.createdAt.toISOString(),
        updatedAt: EXAMPLE_APP_ROLE.updatedAt.toISOString()
      }
    });
    expect(createAppRoleMock).toBeCalledTimes(1);
    expect(createAppRoleMock).toBeCalledWith({
      data: {
        name: EXAMPLE_NAME,
        description: EXAMPLE_DESCRIPTION,
        displayName: EXAMPLE_DISPLAY_NAME,
        app: { connect: { id: EXAMPLE_APP_ID } }
      }
    });
  });

  it('should delete an AppRole', async () => {
    const res = await apolloClient.query({
      query: DELETE_APP_ROLE_MUTATION,
      variables: { id: EXAMPLE_APP_ROLE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      deleteAppRole: {
        ...EXAMPLE_APP_ROLE,
        createdAt: EXAMPLE_APP_ROLE.createdAt.toISOString(),
        updatedAt: EXAMPLE_APP_ROLE.updatedAt.toISOString()
      }
    });
    expect(deleteAppRoleMock).toBeCalledTimes(1);
    expect(deleteAppRoleMock).toBeCalledWith({
      where: { id: EXAMPLE_APP_ROLE_ID }
    });
  });

  it('should update an AppRole', async () => {
    const res = await apolloClient.query({
      query: UPDATE_APP_ROLE_MUTATION,
      variables: { id: EXAMPLE_APP_ROLE_ID, displayName: EXAMPLE_DISPLAY_NAME }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateAppRole: {
        ...EXAMPLE_APP_ROLE,
        createdAt: EXAMPLE_APP_ROLE.createdAt.toISOString(),
        updatedAt: EXAMPLE_APP_ROLE.updatedAt.toISOString()
      }
    });
    expect(updateAppRoleMock).toBeCalledTimes(1);
    expect(updateAppRoleMock).toBeCalledWith({
      where: { id: EXAMPLE_APP_ROLE_ID },
      data: { displayName: EXAMPLE_DISPLAY_NAME }
    });
  });
});
