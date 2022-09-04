import { Test, TestingModule } from '@nestjs/testing';
import { EnumResourceType, PrismaService } from '@amplication/prisma-db';
import { BuildService } from '../build/build.service';
import { EntityService } from '../entity/entity.service';
import { EnvironmentService } from '../environment/environment.service';
import { gql } from 'apollo-server-express';
import {
  ApolloServerTestClient,
  createTestClient
} from 'apollo-server-testing';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { ResourceResolver } from './resource.resolver';
import { INestApplication } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ResourceService } from './resource.service';
import { Resource } from '../../models/Resource';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { Entity } from '../../models/Entity';
import { Build } from '../build/dto/Build';
import { Environment } from '../environment/dto/Environment';
import { User } from '../../models/User';
import { mockGqlAuthGuardCanActivate } from '../../../test/gql-auth-mock';
import { UserService } from '../user/user.service';
import { ResourceCreateInput } from './dto';

const EXAMPLE_RESOURCE_ID = 'exampleResourceId';
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

const EXAMPLE_ENTITY_ID = 'exampleEntityId';

const EXAMPLE_PROJECT_ID = 'exampleProjectId';

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

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true
};

const FIND_ONE_RESOURCE_QUERY = gql`
  query($id: String!) {
    resource(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      resourceType
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
`;

const FIND_MANY_ENTITIES_QUERY = gql`
  query($resourceId: String!, $entityId: String!) {
    resource(where: { id: $resourceId }) {
      entities(where: { id: { equals: $entityId } }) {
        id
        createdAt
        updatedAt
        resourceId
        name
        displayName
        pluralDisplayName
      }
    }
  }
`;

const FIND_MANY_BUILDS_QUERY = gql`
  query($resourceId: String!) {
    resource(where: { id: $resourceId }) {
      builds {
        id
        userId
        resourceId
        version
        actionId
        createdAt
        commitId
      }
    }
  }
`;

const FIND_MANY_ENVIRONMENTS_QUERY = gql`
  query($resourceId: String!) {
    resource(where: { id: $resourceId }) {
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
`;

const CREATE_RESOURCE_MUTATION = gql`
  mutation($data: ResourceCreateInput!) {
    createResource(data: $data) {
      id
      createdAt
      updatedAt
      name
      description
      resourceType
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
`;
const DELETE_RESOURCE_MUTATION = gql`
  mutation($id: String!) {
    deleteResource(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      resourceType
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
`;
const UPDATE_RESOURCE_MUTATION = gql`
  mutation($name: String!, $id: String!) {
    updateResource(data: { name: $name }, where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      resourceType
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
`;

const resourceMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const createResourceMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const deleteResourceMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
});
const updateResourceMock = jest.fn(() => {
  return EXAMPLE_RESOURCE;
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

describe('ResourceResolver', () => {
  let app: INestApplication;
  let apolloClient: ApolloServerTestClient;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceResolver,
        {
          provide: ResourceService,
          useClass: jest.fn(() => ({
            resource: resourceMock,
            createResource: createResourceMock,
            deleteResource: deleteResourceMock,
            updateResource: updateResourceMock
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

  it('should find one resource', async () => {
    const res = await apolloClient.query({
      query: FIND_ONE_RESOURCE_QUERY,
      variables: { id: EXAMPLE_RESOURCE_ID }
    });
    const args = { where: { id: EXAMPLE_RESOURCE_ID } };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      resource: {
        ...EXAMPLE_RESOURCE,
        resourceType: EnumResourceType.Service,

        createdAt: EXAMPLE_RESOURCE.createdAt.toISOString(),
        updatedAt: EXAMPLE_RESOURCE.updatedAt.toISOString(),
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
    expect(resourceMock).toBeCalledTimes(1);
    expect(resourceMock).toBeCalledWith(args);
  });

  it('should find many entities', async () => {
    const res = await apolloClient.query({
      query: FIND_MANY_ENTITIES_QUERY,
      variables: {
        resourceId: EXAMPLE_RESOURCE_ID,
        entityId: EXAMPLE_ENTITY_ID
      }
    });
    const args = {
      where: {
        id: { equals: EXAMPLE_ENTITY_ID },
        resource: { id: EXAMPLE_RESOURCE_ID }
      }
    };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      resource: {
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
      variables: { resourceId: EXAMPLE_RESOURCE_ID }
    });
    const args = {
      where: { resource: { id: EXAMPLE_RESOURCE_ID } }
    };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      resource: {
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
      variables: { resourceId: EXAMPLE_RESOURCE_ID }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      resource: {
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
      where: { resource: { id: EXAMPLE_RESOURCE_ID } }
    });
  });

  it('should create a resource', async () => {
    const resourceCreateInput: ResourceCreateInput = {
      name: EXAMPLE_NAME,
      description: EXAMPLE_DESCRIPTION,
      resourceType: EnumResourceType.Service,
      project: { connect: { id: EXAMPLE_PROJECT_ID } }
    };
    const res = await apolloClient.query({
      query: CREATE_RESOURCE_MUTATION,
      variables: {
        data: resourceCreateInput
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createResource: {
        ...EXAMPLE_RESOURCE,
        resourceType: EnumResourceType.Service,
        createdAt: EXAMPLE_RESOURCE.createdAt.toISOString(),
        updatedAt: EXAMPLE_RESOURCE.updatedAt.toISOString(),
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
    expect(createResourceMock).toBeCalledTimes(1);
    expect(createResourceMock).toBeCalledWith(
      {
        data: resourceCreateInput
      },
      EXAMPLE_USER
    );
  });

  it('should delete an resource', async () => {
    const res = await apolloClient.query({
      query: DELETE_RESOURCE_MUTATION,
      variables: {
        id: EXAMPLE_RESOURCE_ID
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      deleteResource: {
        ...EXAMPLE_RESOURCE,
        createdAt: EXAMPLE_RESOURCE.createdAt.toISOString(),
        updatedAt: EXAMPLE_RESOURCE.updatedAt.toISOString(),
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
    expect(deleteResourceMock).toBeCalledTimes(1);
    expect(deleteResourceMock).toBeCalledWith({
      where: { id: EXAMPLE_RESOURCE_ID }
    });
  });

  it('should update an resource', async () => {
    const res = await apolloClient.query({
      query: UPDATE_RESOURCE_MUTATION,
      variables: {
        name: EXAMPLE_NAME,
        id: EXAMPLE_RESOURCE_ID
      }
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateResource: {
        ...EXAMPLE_RESOURCE,
        createdAt: EXAMPLE_RESOURCE.createdAt.toISOString(),
        updatedAt: EXAMPLE_RESOURCE.updatedAt.toISOString(),
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
    expect(updateResourceMock).toBeCalledTimes(1);
    expect(updateResourceMock).toBeCalledWith({
      data: { name: EXAMPLE_NAME },
      where: { id: EXAMPLE_RESOURCE_ID }
    });
  });
});
