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
import { BuildResolver } from './build.resolver';
import { BuildService } from './build.service';
import { ActionService } from '../action/action.service';
import { UserService } from '../user/user.service';
import { Build } from './dto/Build';
import { User } from 'src/models/';
import { Action } from '../action/dto/Action';
import { EnumBuildStatus } from './dto/EnumBuildStatus';
import { Deployment } from '../deployment/dto/Deployment';
import { EnumDeploymentStatus } from '../deployment/dto/EnumDeploymentStatus';

const EXAMPLE_BUILD_ID = 'exampleBuildId';
const EXAMPLE_COMMIT_ID = 'exampleCommitId';
const EXAMPLE_APP_ID = 'exampleAppId';
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_VERSION = 'exampleVersion';
const EXAMPLE_ACTION_ID = 'exampleActionId';
const EXAMPLE_DEPLOYMENT_ID = 'exampleDeploymentId';
const EXAMPLE_ENVIRONMENT_ID = 'exampleEnvironmentId';
const EXAMPLE_MESSAGE = 'exampleMessage';

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date()
};

const EXAMPLE_ACTION: Action = {
  id: EXAMPLE_ACTION_ID,
  createdAt: new Date()
};

const EXAMPLE_DEPLOYMENT: Deployment = {
  id: EXAMPLE_DEPLOYMENT_ID,
  environmentId: EXAMPLE_ENVIRONMENT_ID,
  userId: EXAMPLE_USER_ID,
  buildId: EXAMPLE_BUILD_ID,
  status: EnumDeploymentStatus.Completed,
  actionId: EXAMPLE_ACTION_ID,
  createdAt: new Date()
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  appId: EXAMPLE_APP_ID,
  userId: EXAMPLE_USER_ID,
  version: EXAMPLE_VERSION,
  actionId: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID
};

const FIND_MANY_BUILDS_QUERY = gql`
  query {
    builds {
      id
      appId
      userId
      version
      actionId
      createdAt
      commitId
    }
  }
`;

const FIND_ONE_BUILD_QUERY = gql`
  query($id: String!) {
    build(where: { id: $id }) {
      id
      appId
      userId
      version
      actionId
      createdAt
      commitId
    }
  }
`;

const FIND_USER_QUERY = gql`
  query($id: String!) {
    build(where: { id: $id }) {
      createdBy {
        id
        createdAt
        updatedAt
      }
    }
  }
`;

const FIND_ACTION_QUERY = gql`
  query($id: String!) {
    build(where: { id: $id }) {
      action {
        id
        createdAt
      }
    }
  }
`;

const ARCHIVE_URI_QUERY = gql`
  query($id: String!) {
    build(where: { id: $id }) {
      archiveURI
    }
  }
`;

const BUILD_STATUS_QUERY = gql`
  query($id: String!) {
    build(where: { id: $id }) {
      status
    }
  }
`;

const GET_DEPLOYMENTS_QUERY = gql`
  query($buildId: String!) {
    build(where: { id: $buildId }) {
      deployments {
        id
        environmentId
        userId
        buildId
        status
        actionId
        createdAt
      }
    }
  }
`;

const CREATE_BUILD_MUTATION = gql`
  mutation($appId: String!, $commitId: String!, $message: String!) {
    createBuild(
      data: {
        app: { connect: { id: $appId } }
        commit: { connect: { id: $commitId } }
        message: $message
      }
    ) {
      id
      appId
      userId
      version
      actionId
      createdAt
      commitId
    }
  }
`;

const buildServiceFindManyMock = jest.fn(() => [EXAMPLE_BUILD]);
const buildServiceFindOneMock = jest.fn(() => EXAMPLE_BUILD);
const buildServiceCreateMock = jest.fn(() => EXAMPLE_BUILD);
const userServiceFindUserMock = jest.fn(() => EXAMPLE_USER);
const actionServiceFindOneMock = jest.fn(() => EXAMPLE_ACTION);
const buildServiceCalcBuildStatusMock = jest.fn(() => {
  return EnumBuildStatus.Completed;
});
const buildServiceGetDeploymentsMock = jest.fn(() => [EXAMPLE_DEPLOYMENT]);

const mockCanActivate = jest.fn(() => true);

describe('BuildResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        BuildResolver,
        {
          provide: BuildService,
          useClass: jest.fn(() => ({
            findMany: buildServiceFindManyMock,
            findOne: buildServiceFindOneMock,
            calcBuildStatus: buildServiceCalcBuildStatusMock,
            getDeployments: buildServiceGetDeploymentsMock,
            create: buildServiceCreateMock
          }))
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUser: userServiceFindUserMock
          }))
        },
        {
          provide: ActionService,
          useClass: jest.fn(() => ({
            findOne: actionServiceFindOneMock
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

  it('should find many builds', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_BUILDS_QUERY,
      variables: {}
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      builds: [
        {
          ...EXAMPLE_BUILD,
          createdAt: EXAMPLE_BUILD.createdAt.toISOString()
        }
      ]
    });
    expect(buildServiceFindManyMock).toBeCalledTimes(1);
    expect(buildServiceFindManyMock).toBeCalledWith({});
  });

  it('should find one build', async () => {
    const res = await apolloClient.query({
      query: FIND_ONE_BUILD_QUERY,
      variables: { id: EXAMPLE_BUILD_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        ...EXAMPLE_BUILD,
        createdAt: EXAMPLE_BUILD.createdAt.toISOString()
      }
    });
    expect(buildServiceFindOneMock).toBeCalledTimes(1);
    expect(buildServiceFindOneMock).toBeCalledWith({
      where: { id: EXAMPLE_BUILD_ID }
    });
  });

  it('should find a builds creating user', async () => {
    const res = await apolloClient.query({
      query: FIND_USER_QUERY,
      variables: { id: EXAMPLE_BUILD_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        createdBy: {
          ...EXAMPLE_USER,
          createdAt: EXAMPLE_USER.createdAt.toISOString(),
          updatedAt: EXAMPLE_USER.updatedAt.toISOString()
        }
      }
    });
    expect(userServiceFindUserMock).toBeCalledTimes(1);
    expect(userServiceFindUserMock).toBeCalledWith({
      where: { id: EXAMPLE_USER_ID }
    });
  });

  it('should find a builds action', async () => {
    const res = await apolloClient.query({
      query: FIND_ACTION_QUERY,
      variables: { id: EXAMPLE_BUILD_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        action: {
          ...EXAMPLE_ACTION,
          createdAt: EXAMPLE_ACTION.createdAt.toISOString()
        }
      }
    });
    expect(actionServiceFindOneMock).toBeCalledTimes(1);
    expect(actionServiceFindOneMock).toBeCalledWith({
      where: { id: EXAMPLE_ACTION_ID }
    });
  });

  it('should return the build archive URI', async () => {
    const res = await apolloClient.query({
      query: ARCHIVE_URI_QUERY,
      variables: { id: EXAMPLE_BUILD_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        archiveURI: `/generated-apps/${EXAMPLE_BUILD_ID}.zip`
      }
    });
  });

  it('should get a build status', async () => {
    const res = await apolloClient.query({
      query: BUILD_STATUS_QUERY,
      variables: { id: EXAMPLE_BUILD_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        status: EnumBuildStatus.Completed
      }
    });
    expect(buildServiceCalcBuildStatusMock).toBeCalledTimes(1);
    expect(buildServiceCalcBuildStatusMock).toBeCalledWith(EXAMPLE_BUILD_ID);
  });

  it('should get a builds deployments', async () => {
    const res = await apolloClient.query({
      query: GET_DEPLOYMENTS_QUERY,
      variables: { buildId: EXAMPLE_BUILD_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        deployments: [
          {
            ...EXAMPLE_DEPLOYMENT,
            createdAt: EXAMPLE_DEPLOYMENT.createdAt.toISOString()
          }
        ]
      }
    });
    expect(buildServiceGetDeploymentsMock).toBeCalledTimes(1);
    expect(buildServiceGetDeploymentsMock).toBeCalledWith(EXAMPLE_BUILD_ID, {});
  });

  it('should create a build', async () => {
    const args = {
      data: {
        app: { connect: { id: EXAMPLE_APP_ID } },
        commit: { connect: { id: EXAMPLE_COMMIT_ID } },
        message: EXAMPLE_MESSAGE
      }
    };
    const res = await apolloClient.mutate({
      mutation: CREATE_BUILD_MUTATION,
      variables: {
        appId: EXAMPLE_APP_ID,
        commitId: EXAMPLE_COMMIT_ID,
        message: EXAMPLE_MESSAGE
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createBuild: {
        ...EXAMPLE_BUILD,
        createdAt: EXAMPLE_BUILD.createdAt.toISOString()
      }
    });
    expect(buildServiceCreateMock).toBeCalledTimes(1);
    expect(buildServiceCreateMock).toBeCalledWith(args);
  });
});
