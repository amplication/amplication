import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { Commit, Entity, Resource, User } from '../../models';
import { mockGqlAuthGuardCanActivate } from '../../../test/gql-auth-mock';
import { Environment } from '../environment/dto';
import { Build } from '../build/dto/Build';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import {
  EnumResourceType,
  EnumPendingChangeAction,
  EnumPendingChangeOriginType
} from '@amplication/code-gen-types/dist/models';
import { PendingChange } from '../resource/dto/PendingChange';
import { ResourceService } from '../resource/resource.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

/** values mock */
const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_MESSAGE = 'exampleMessage';
const EXAMPLE_PROJECT_ID = 'exampleProjectId';
const EXAMPLE_COMMIT_ID = 'exampleCommitId';
const EXAMPLE_RESOURCE_ID = 'exampleResourceId';
const EXAMPLE_ENTITY_ID = 'exampleEntityId';
const EXAMPLE_ORIGIN_ID = 'exampleOriginId';
const EXAMPLE_VERSION_NUMBER = 1;
const EXAMPLE_NAME = 'exampleName';
const EXAMPLE_DESCRIPTION = 'exampleDescription';
const EXAMPLE_DISPLAY_NAME = 'exampleDisplayName';
const EXAMPLE_PLURAL_DISPLAY_NAME = 'examplePluralDisplayName';
const EXAMPLE_BUILD_ID = 'exampleBuildId';
const EXAMPLE_VERSION = 'exampleVersion';
const EXAMPLE_ACTION_ID = 'exampleActionId';
const EXAMPLE_ENVIRONMENT_ID = 'exampleEnvironmentId';
const EXAMPLE_ADDRESS = 'exampleAddress';

/** models mock */
const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true
};

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
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_NAME,
  address: EXAMPLE_ADDRESS
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  userId: EXAMPLE_USER_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  version: EXAMPLE_VERSION,
  actionId: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID
};

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_PLURAL_DISPLAY_NAME
};

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  resourceType: EnumResourceType.Service,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  description: EXAMPLE_DESCRIPTION,
  entities: [EXAMPLE_ENTITY],
  builds: [EXAMPLE_BUILD],
  environments: [EXAMPLE_ENVIRONMENT],
  gitRepositoryOverride: false
};

const EXAMPLE_PENDING_CHANGE: PendingChange = {
  action: EnumPendingChangeAction.Create,
  originType: EnumPendingChangeOriginType.Entity,
  originId: EXAMPLE_ORIGIN_ID,
  origin: EXAMPLE_ENTITY,
  versionNumber: EXAMPLE_VERSION_NUMBER,
  resource: EXAMPLE_RESOURCE
};

/** graphql query mocks */
const DISCARD_CHANGES_MUTATION = gql`
  mutation($projectId: String!) {
    discardPendingChanges(data: { project: { connect: { id: $projectId } } })
  }
`;

const COMMIT_MUTATION = gql`
  mutation($message: String!, $projectId: String!) {
    commit(
      data: { message: $message, project: { connect: { id: $projectId } } }
    ) {
      id
      createdAt
      userId
      message
    }
  }
`;

const PENDING_CHANGE_QUERY = gql`
  query($projectId: String!) {
    pendingChanges(where: { project: { id: $projectId } }) {
      action
      originType
      originId
      versionNumber
      origin {
        ... on Entity {
          id
          createdAt
          updatedAt
          resourceId
          name
          displayName
          pluralDisplayName
        }
        ... on Block {
          id
          displayName
          updatedAt
        }
      }
      resource {
        id
        resourceType
        createdAt
        updatedAt
        name
        description
        gitRepositoryOverride
        entities {
          id
          createdAt
          updatedAt
          resourceId
          name
          displayName
          pluralDisplayName
        }
        builds {
          id
          userId
          resourceId
          version
          actionId
          createdAt
          commitId
        }
        environments {
          id
          createdAt
          updatedAt
          resourceId
          name
          address
        }
      }
    }
  }
`;

/** methods mock */
const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));
const resourcesMock = jest.fn(() => {
  return [EXAMPLE_RESOURCE];
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

describe('ProjectResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GraphQLModule.forRoot({ autoSchemaFile: true })],
      providers: [
        ProjectResolver,
        {
          provide: ProjectService,
          useClass: jest.fn(() => ({
            commit: commitMock,
            discardPendingChanges: discardPendingChangesMock,
            getPendingChanges: getPendingChangesMock
          }))
        },
        {
          provide: ResourceService,
          useClass: jest.fn(() => ({
            resources: resourcesMock
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
      ]
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({ canActivate: mockCanActivate })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const graphqlModule = moduleFixture.get(GraphQLModule) as any;
    apolloClient = createTestClient(graphqlModule.apolloServer);
  });

  it('should commit', async () => {
    const res = await apolloClient.query({
      query: COMMIT_MUTATION,
      variables: { message: EXAMPLE_MESSAGE, projectId: EXAMPLE_PROJECT_ID }
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
        project: { connect: { id: EXAMPLE_PROJECT_ID } }
      }
    });
  });

  it('should discard pending changes', async () => {
    const res = await apolloClient.query({
      query: DISCARD_CHANGES_MUTATION,
      variables: { projectId: EXAMPLE_PROJECT_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      discardPendingChanges: true
    });
    expect(discardPendingChangesMock).toBeCalledTimes(1);
    expect(discardPendingChangesMock).toBeCalledWith({
      data: { project: { connect: { id: EXAMPLE_PROJECT_ID } } }
    });
  });

  it('should get a pending change', async () => {
    const res = await apolloClient.query({
      query: PENDING_CHANGE_QUERY,
      variables: { projectId: EXAMPLE_PROJECT_ID }
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
          },
          resource: {
            ...EXAMPLE_RESOURCE,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
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
                createdAt: EXAMPLE_ENTITY.createdAt.toISOString()
              }
            ],
            environments: [
              {
                ...EXAMPLE_ENVIRONMENT,
                createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
                updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString()
              }
            ]
          }
        }
      ]
    });
    expect(getPendingChangesMock).toBeCalledTimes(1);
    expect(getPendingChangesMock).toBeCalledWith(
      {
        where: { project: { id: EXAMPLE_PROJECT_ID } }
      },
      EXAMPLE_USER
    );
  });
});
