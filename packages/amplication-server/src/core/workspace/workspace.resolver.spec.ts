import { Test, TestingModule } from '@nestjs/testing';
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
import { mockGqlAuthGuardCanActivate } from '../../../test/gql-auth-mock';
import { WorkspaceService } from './workspace.service';
import { WorkspaceResolver } from './workspace.resolver';
import { App, Workspace, User } from 'src/models';
import { AppService } from '../app/app.service';

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_WORKSPACE_ID = 'exampleWorkspaceId';
const EXAMPLE_WORKSPACE_NAME = 'exampleWorkspaceName';

const EXAMPLE_APP_ID = 'exampleAppId';
const EXAMPLE_APP_NAME = 'exampleAppName';
const EXAMPLE_APP_DESCRIPTION = 'exampleAppDescription';

const EXAMPLE_EMAIL = 'exampleEmail';

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  name: EXAMPLE_WORKSPACE_NAME,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_APP: App = {
  id: EXAMPLE_APP_ID,
  name: EXAMPLE_APP_NAME,
  description: EXAMPLE_APP_DESCRIPTION,
  createdAt: new Date(),
  updatedAt: new Date(),
  githubSyncEnabled: false
};

const GET_WORKSPACE_QUERY = gql`
  query($id: String!) {
    workspace(where: { id: $id }) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const GET_APPS_QUERY = gql`
  query($id: String!) {
    workspace(where: { id: $id }) {
      apps {
        id
        name
        description
        githubSyncEnabled
        createdAt
        updatedAt
      }
    }
  }
`;

const DELETE_WORKSPACE_MUTATION = gql`
  mutation($id: String!) {
    deleteWorkspace(where: { id: $id }) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_WORKSPACE_MUTATION = gql`
  mutation($id: String!) {
    updateWorkspace(data: {}, where: { id: $id }) {
      id
      name
      createdAt
      updatedAt
    }
  }
`;

const INVITE_USER_MUTATION = gql`
  mutation($email: String!) {
    inviteUser(data: { email: $email }) {
      id
      createdAt
      updatedAt
    }
  }
`;

const workspaceServiceGetWorkspaceMock = jest.fn(() => EXAMPLE_WORKSPACE);
const workspaceServiceDeleteWorkspaceMock = jest.fn(() => EXAMPLE_WORKSPACE);
const workspaceServiceUpdateWorkspaceMock = jest.fn(() => EXAMPLE_WORKSPACE);
const workspaceServiceInviteUserMock = jest.fn(() => EXAMPLE_USER);
const appServiceAppsMock = jest.fn(() => [EXAMPLE_APP]);

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

describe('WorkspaceResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceResolver,
        {
          provide: WorkspaceService,
          useClass: jest.fn(() => ({
            getWorkspace: workspaceServiceGetWorkspaceMock,
            deleteWorkspace: workspaceServiceDeleteWorkspaceMock,
            updateWorkspace: workspaceServiceUpdateWorkspaceMock,
            inviteUser: workspaceServiceInviteUserMock
          }))
        },
        {
          provide: AppService,
          useClass: jest.fn(() => ({
            apps: appServiceAppsMock
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

  it('should get an workspace', async () => {
    const res = await apolloClient.query({
      query: GET_WORKSPACE_QUERY,
      variables: { id: EXAMPLE_WORKSPACE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      workspace: {
        ...EXAMPLE_WORKSPACE,
        createdAt: EXAMPLE_WORKSPACE.createdAt.toISOString(),
        updatedAt: EXAMPLE_WORKSPACE.updatedAt.toISOString()
      }
    });
    expect(workspaceServiceGetWorkspaceMock).toBeCalledTimes(1);
    expect(workspaceServiceGetWorkspaceMock).toBeCalledWith({
      where: { id: EXAMPLE_WORKSPACE_ID }
    });
  });

  it('should get an workspace apps', async () => {
    const res = await apolloClient.query({
      query: GET_APPS_QUERY,
      variables: { id: EXAMPLE_WORKSPACE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      workspace: {
        apps: [
          {
            ...EXAMPLE_APP,
            createdAt: EXAMPLE_APP.createdAt.toISOString(),
            updatedAt: EXAMPLE_APP.updatedAt.toISOString()
          }
        ]
      }
    });
    expect(appServiceAppsMock).toBeCalledTimes(1);
    expect(appServiceAppsMock).toBeCalledWith({
      where: { workspace: { id: EXAMPLE_WORKSPACE_ID } }
    });
  });

  it('should delete an workspace', async () => {
    const res = await apolloClient.mutate({
      mutation: DELETE_WORKSPACE_MUTATION,
      variables: { id: EXAMPLE_WORKSPACE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      deleteWorkspace: {
        ...EXAMPLE_WORKSPACE,
        createdAt: EXAMPLE_WORKSPACE.createdAt.toISOString(),
        updatedAt: EXAMPLE_WORKSPACE.updatedAt.toISOString()
      }
    });
    expect(workspaceServiceDeleteWorkspaceMock).toBeCalledTimes(1);
    expect(workspaceServiceDeleteWorkspaceMock).toBeCalledWith({
      where: { id: EXAMPLE_WORKSPACE_ID }
    });
  });

  it('should update an workspace', async () => {
    const res = await apolloClient.mutate({
      mutation: UPDATE_WORKSPACE_MUTATION,
      variables: { id: EXAMPLE_WORKSPACE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateWorkspace: {
        ...EXAMPLE_WORKSPACE,
        createdAt: EXAMPLE_WORKSPACE.createdAt.toISOString(),
        updatedAt: EXAMPLE_WORKSPACE.updatedAt.toISOString()
      }
    });
    expect(workspaceServiceUpdateWorkspaceMock).toBeCalledTimes(1);
    expect(workspaceServiceUpdateWorkspaceMock).toBeCalledWith({
      data: {},
      where: { id: EXAMPLE_WORKSPACE_ID }
    });
  });

  it('should invite a user', async () => {
    const res = await apolloClient.mutate({
      mutation: INVITE_USER_MUTATION,
      variables: { email: EXAMPLE_EMAIL }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      inviteUser: {
        ...EXAMPLE_USER,
        createdAt: EXAMPLE_USER.createdAt.toISOString(),
        updatedAt: EXAMPLE_USER.updatedAt.toISOString()
      }
    });
    expect(workspaceServiceInviteUserMock).toBeCalledTimes(1);
    expect(workspaceServiceInviteUserMock).toBeCalledWith(EXAMPLE_USER, {
      data: { email: EXAMPLE_EMAIL }
    });
  });
});
