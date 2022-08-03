import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@amplication/prisma-db';
import { BuildService } from '../build/build.service';
import { EntityService } from '../entity/entity.service';
import { EnvironmentService } from '../environment/environment.service';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { AppResolver } from './app.resolver';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppService } from './app.service';
import { App } from 'src/models/App';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { Entity } from 'src/models/Entity';
import { Build } from '../build/dto/Build';
import { Environment } from '../environment/dto/Environment';
import { User } from 'src/models/User';
import { Commit } from 'src/models/Commit';
import { PendingChange } from './dto/PendingChange';
import {
  EnumPendingChangeAction,
  EnumPendingChangeOriginType
} from '@amplication/code-gen-types/dist/models';
import { mockGqlAuthGuardCanActivate } from '../../../test/gql-auth-mock';
import { UserService } from '../user/user.service';

const EXAMPLE_APP_ID = 'exampleAppId';
const EXAMPLE_NAME = 'exampleName';
const EXAMPLE_DESCRIPTION = 'exampleDescription';
const EXAMPLE_DISPLAY_NAME = 'exampleDisplayName';
const EXAMPLE_PLURAL_DISPLAY_NAME = 'examplePluralDisplayName';

const EXAMPLE_BUILD_ID = 'exampleBuildId';
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_VERSION = 'exampleVersion';
const EXAMPLE_ACTION_ID = 'exampleActionId';

const EXAMPLE_ENVIRONMENT_ID = 'exampleEnvironmentId';
const EXAMPLE_ADDRESS = 'exampleAddress';

const EXAMPLE_COMMIT_ID = 'exampleCommitId';
const EXAMPLE_MESSAGE = 'exampleMessage';

const EXAMPLE_ENTITY_ID = 'exampleEntityId';

const EXAMPLE_ORIGIN_ID = 'exampleOriginId';
const EXAMPLE_VERSION_NUMBER = 1;

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE
};

const EXAMPLE_ENVIRONMENT: Environment = {
  id: EXAMPLE_ENVIRONMENT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: EXAMPLE_APP_ID,
  name: EXAMPLE_NAME,
  address: EXAMPLE_ADDRESS
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  userId: EXAMPLE_USER_ID,
  appId: EXAMPLE_APP_ID,
  version: EXAMPLE_VERSION,
  actionId: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID
};

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  appId: EXAMPLE_APP_ID,
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_PLURAL_DISPLAY_NAME
};

const EXAMPLE_APP: App = {
  id: EXAMPLE_APP_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  description: EXAMPLE_DESCRIPTION,
  entities: [EXAMPLE_ENTITY],
  builds: [EXAMPLE_BUILD],
  environments: [EXAMPLE_ENVIRONMENT]
};

const EXAMPLE_PENDING_CHANGE: PendingChange = {
  action: EnumPendingChangeAction.Create,
  originType: EnumPendingChangeOriginType.Entity,
  originId: EXAMPLE_ORIGIN_ID,
  origin: EXAMPLE_ENTITY,
  versionNumber: EXAMPLE_VERSION_NUMBER
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true
};

const FIND_ONE_APP_QUERY = gql`
  query($id: String!) {
    app(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      entities {
        id
        createdAt
        updatedAt
        appId
        name
        displayName
        pluralDisplayName
      }
      builds {
        id
        userId
        appId
        version
        actionId
        createdAt
        commitId
      }
      environments {
        id
        createdAt
        updatedAt
        appId
        name
        address
      }
    }
  }
`;

const FIND_MANY_ENTITIES_QUERY = gql`
  query($appId: String!, $entityId: String!) {
    app(where: { id: $appId }) {
      entities(where: { id: { equals: $entityId } }) {
        id
        createdAt
        updatedAt
        appId
        name
        displayName
        pluralDisplayName
      }
    }
  }
`;

const FIND_MANY_BUILDS_QUERY = gql`
  query($appId: String!) {
    app(where: { id: $appId }) {
      builds {
        id
        userId
        appId
        version
        actionId
        createdAt
        commitId
      }
    }
  }
`;

const FIND_MANY_ENVIRONMENTS_QUERY = gql`
  query($appId: String!) {
    app(where: { id: $appId }) {
      environments {
        id
        createdAt
        updatedAt
        appId
        name
        address
      }
    }
  }
`;

const CREATE_APP_MUTATION = gql`
  mutation($name: String!, $description: String!) {
    createApp(data: { name: $name, description: $description }) {
      id
      createdAt
      updatedAt
      name
      description
      entities {
        id
        createdAt
        updatedAt
        appId
        name
        displayName
        pluralDisplayName
      }
      builds {
        id
        userId
        appId
        version
        actionId
        createdAt
        commitId
      }
      environments {
        id
        createdAt
        updatedAt
        appId
        name
        address
      }
    }
  }
`;
const DELETE_APP_MUTATION = gql`
  mutation($id: String!) {
    deleteApp(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      entities {
        id
        createdAt
        updatedAt
        appId
        name
        displayName
        pluralDisplayName
      }
      builds {
        id
        userId
        appId
        version
        actionId
        createdAt
        commitId
      }
      environments {
        id
        createdAt
        updatedAt
        appId
        name
        address
      }
    }
  }
`;
const UPDATE_APP_MUTATION = gql`
  mutation($name: String!, $id: String!) {
    updateApp(data: { name: $name }, where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      entities {
        id
        createdAt
        updatedAt
        appId
        name
        displayName
        pluralDisplayName
      }
      builds {
        id
        userId
        appId
        version
        actionId
        createdAt
        commitId
      }
      environments {
        id
        createdAt
        updatedAt
        appId
        name
        address
      }
    }
  }
`;

const DISCARD_CHANGES_MUTATION = gql`
  mutation($appId: String!) {
    discardPendingChanges(data: { app: { connect: { id: $appId } } })
  }
`;

const COMMIT_MUTATION = gql`
  mutation($message: String!, $appId: String!) {
    commit(data: { message: $message, app: { connect: { id: $appId } } }) {
      id
      createdAt
      userId
      message
    }
  }
`;

const PENDING_CHANGE_QUERY = gql`
  query($appId: String!) {
    pendingChanges(where: { app: { id: $appId } }) {
      action
      originType
      originId
      versionNumber
      origin {
        ... on Entity {
          id
          createdAt
          updatedAt
          appId
          name
          displayName
          pluralDisplayName
        }
      }
    }
  }
`;

const appMock = jest.fn(() => {
  return EXAMPLE_APP;
});
const createAppMock = jest.fn(() => {
  return EXAMPLE_APP;
});
const deleteAppMock = jest.fn(() => {
  return EXAMPLE_APP;
});
const updateAppMock = jest.fn(() => {
  return EXAMPLE_APP;
});
const commitMock = jest.fn(() => {
  return EXAMPLE_COMMIT;
});
const discardPendingChangesMock = jest.fn(() => {
  return true;
});
const getPendingChangesMock = jest.fn(() => {
  return [EXAMPLE_PENDING_CHANGE];
});
const entitiesMock = jest.fn(() => {
  return [EXAMPLE_ENTITY];
});
const findManyBuildMock = jest.fn(() => {
  return [EXAMPLE_BUILD];
});
const findManyEnvironmentsMock = jest.fn(() => {
  return [EXAMPLE_ENVIRONMENT];
});
const userServiceFindUserMock = jest.fn(() => EXAMPLE_USER);

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

describe('AppResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AppResolver,
        {
          provide: AppService,
          useClass: jest.fn(() => ({
            app: appMock,
            createApp: createAppMock,
            deleteApp: deleteAppMock,
            updateApp: updateAppMock,
            commit: commitMock,
            discardPendingChanges: discardPendingChangesMock,
            getPendingChanges: getPendingChangesMock
          }))
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUser: userServiceFindUserMock
          }))
        },
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            entities: entitiesMock
          }))
        },
        {
          provide: BuildService,
          useClass: jest.fn(() => ({
            findMany: findManyBuildMock
          }))
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useClass: jest.fn(() => ({
            error: jest.fn()
          }))
        },
        {
          provide: EnvironmentService,
          useClass: jest.fn(() => ({
            findMany: findManyEnvironmentsMock
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

  it('should find one app', async () => {
    const res = await apolloClient.query({
      query: FIND_ONE_APP_QUERY,
      variables: { id: EXAMPLE_APP_ID }
    });
    const args = { where: { id: EXAMPLE_APP_ID } };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      app: {
        ...EXAMPLE_APP,
        createdAt: EXAMPLE_APP.createdAt.toISOString(),
        updatedAt: EXAMPLE_APP.updatedAt.toISOString(),
        entities: [
          {
            ...EXAMPLE_ENTITY,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
          }
        ],
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString()
          }
        ],
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString()
          }
        ]
      }
    });
    expect(appMock).toBeCalledTimes(1);
    expect(appMock).toBeCalledWith(args);
  });

  it('should find many entities', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_ENTITIES_QUERY,
      variables: { appId: EXAMPLE_APP_ID, entityId: EXAMPLE_ENTITY_ID }
    });
    const args = {
      where: { id: { equals: EXAMPLE_ENTITY_ID }, app: { id: EXAMPLE_APP_ID } }
    };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      app: {
        entities: [
          {
            ...EXAMPLE_ENTITY,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
          }
        ]
      }
    });
    expect(entitiesMock).toBeCalledTimes(1);
    expect(entitiesMock).toBeCalledWith(args);
  });

  it('should find many builds', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_BUILDS_QUERY,
      variables: { appId: EXAMPLE_APP_ID }
    });
    const args = {
      where: { app: { id: EXAMPLE_APP_ID } }
    };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      app: {
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString()
          }
        ]
      }
    });
    expect(findManyBuildMock).toBeCalledTimes(1);
    expect(findManyBuildMock).toBeCalledWith(args);
  });

  it('should find many environments', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_ENVIRONMENTS_QUERY,
      variables: { appId: EXAMPLE_APP_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      app: {
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString()
          }
        ]
      }
    });
    expect(findManyEnvironmentsMock).toBeCalledTimes(1);
    expect(findManyEnvironmentsMock).toBeCalledWith({
      where: { app: { id: EXAMPLE_APP_ID } }
    });
  });

  it('should create an app', async () => {
    const res = await apolloClient.query({
      query: CREATE_APP_MUTATION,
      variables: {
        name: EXAMPLE_NAME,
        description: EXAMPLE_DESCRIPTION
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createApp: {
        ...EXAMPLE_APP,
        createdAt: EXAMPLE_APP.createdAt.toISOString(),
        updatedAt: EXAMPLE_APP.updatedAt.toISOString(),
        entities: [
          {
            ...EXAMPLE_ENTITY,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
          }
        ],
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString()
          }
        ],
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString()
          }
        ]
      }
    });
    expect(createAppMock).toBeCalledTimes(1);
    expect(createAppMock).toBeCalledWith(
      {
        data: {
          name: EXAMPLE_NAME,
          description: EXAMPLE_DESCRIPTION
        }
      },
      EXAMPLE_USER
    );
  });

  it('should delete an app', async () => {
    const res = await apolloClient.query({
      query: DELETE_APP_MUTATION,
      variables: {
        id: EXAMPLE_APP_ID
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      deleteApp: {
        ...EXAMPLE_APP,
        createdAt: EXAMPLE_APP.createdAt.toISOString(),
        updatedAt: EXAMPLE_APP.updatedAt.toISOString(),
        entities: [
          {
            ...EXAMPLE_ENTITY,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
          }
        ],
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString()
          }
        ],
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString()
          }
        ]
      }
    });
    expect(deleteAppMock).toBeCalledTimes(1);
    expect(deleteAppMock).toBeCalledWith({ where: { id: EXAMPLE_APP_ID } });
  });

  it('should update an app', async () => {
    const res = await apolloClient.query({
      query: UPDATE_APP_MUTATION,
      variables: {
        name: EXAMPLE_NAME,
        id: EXAMPLE_APP_ID
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateApp: {
        ...EXAMPLE_APP,
        createdAt: EXAMPLE_APP.createdAt.toISOString(),
        updatedAt: EXAMPLE_APP.updatedAt.toISOString(),
        entities: [
          {
            ...EXAMPLE_ENTITY,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
          }
        ],
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString()
          }
        ],
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString()
          }
        ]
      }
    });
    expect(updateAppMock).toBeCalledTimes(1);
    expect(updateAppMock).toBeCalledWith({
      data: { name: EXAMPLE_NAME },
      where: { id: EXAMPLE_APP_ID }
    });
  });

  it('should commit', async () => {
    const res = await apolloClient.query({
      query: COMMIT_MUTATION,
      variables: { message: EXAMPLE_MESSAGE, appId: EXAMPLE_APP_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      commit: {
        ...EXAMPLE_COMMIT,
        createdAt: EXAMPLE_COMMIT.createdAt.toISOString()
      }
    });
    expect(commitMock).toBeCalledTimes(1);
    expect(commitMock).toBeCalledWith({
      data: {
        message: EXAMPLE_MESSAGE,
        app: { connect: { id: EXAMPLE_APP_ID } }
      }
    });
  });

  it('should discard pending changes', async () => {
    const res = await apolloClient.query({
      query: DISCARD_CHANGES_MUTATION,
      variables: { appId: EXAMPLE_APP_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      discardPendingChanges: true
    });
    expect(discardPendingChangesMock).toBeCalledTimes(1);
    expect(discardPendingChangesMock).toBeCalledWith({
      data: { app: { connect: { id: EXAMPLE_APP_ID } } }
    });
  });

  it('should get a pending change', async () => {
    const res = await apolloClient.query({
      query: PENDING_CHANGE_QUERY,
      variables: { appId: EXAMPLE_APP_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      pendingChanges: [
        {
          ...EXAMPLE_PENDING_CHANGE,
          origin: {
            ...EXAMPLE_ENTITY,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
          }
        }
      ]
    });
    expect(getPendingChangesMock).toBeCalledTimes(1);
    expect(getPendingChangesMock).toBeCalledWith(
      {
        where: { app: { id: EXAMPLE_APP_ID } }
      },
      EXAMPLE_USER
    );
  });
});
