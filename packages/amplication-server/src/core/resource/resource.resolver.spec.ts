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
import { Entity } from "../../models/Entity";
import { Resource } from "../../models/Resource";
import { User } from "../../models/User";
import { EnumResourceType, PrismaService } from "../../prisma";
import { BuildService } from "../build/build.service";
import { Build } from "../build/dto/Build";
import { EntityService } from "../entity/entity.service";
import { Environment } from "../environment/dto/Environment";
import { EnvironmentService } from "../environment/environment.service";
import { UserService } from "../user/user.service";
import { ResourceCreateInput } from "./dto";
import { ResourceResolver } from "./resource.resolver";
import { ResourceService } from "./resource.service";
import { EnumCodeGenerator } from "./dto/EnumCodeGenerator";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { ResourceVersionService } from "../resourceVersion/resourceVersion.service";
import { EnumBuildStatus } from "../build/dto/EnumBuildStatus";
import { EnumBuildGitStatus } from "../build/dto/EnumBuildGitStatus";
import { OwnershipService } from "../ownership/ownership.service";
import { EnumOwnershipType } from "../ownership/dto/Ownership";
import { ProjectService } from "../project/project.service";
import { BlueprintService } from "../blueprint/blueprint.service";
import { RelationService } from "../relation/relation.service";
import { ResourceSettingsService } from "../resourceSettings/resourceSettings.service";

const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_NAME = "exampleName";
const EXAMPLE_DESCRIPTION = "exampleDescription";
const EXAMPLE_DISPLAY_NAME = "exampleDisplayName";
const EXAMPLE_PLURAL_DISPLAY_NAME = "examplePluralDisplayName";
const EXAMPLE_CUSTOM_ATTRIBUTES = "exampleCustomAttributes";

const EXAMPLE_BUILD_ID = "exampleBuildId";
const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_VERSION = "exampleVersion";
const EXAMPLE_ACTION_ID = "exampleActionId";

const EXAMPLE_ENVIRONMENT_ID = "exampleEnvironmentId";
const EXAMPLE_ADDRESS = "exampleAddress";

const EXAMPLE_COMMIT_ID = "exampleCommitId";

const EXAMPLE_ENTITY_ID = "exampleEntityId";

const EXAMPLE_PROJECT_ID = "exampleProjectId";

const EXAMPLE_ENVIRONMENT: Environment = {
  id: EXAMPLE_ENVIRONMENT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_NAME,
  address: EXAMPLE_ADDRESS,
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  userId: EXAMPLE_USER_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  version: EXAMPLE_VERSION,
  actionId: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID,
  status: EnumBuildStatus.Completed,
  gitStatus: EnumBuildGitStatus.Completed,
};

const EXAMPLE_ENTITY: Entity = {
  id: EXAMPLE_ENTITY_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_NAME,
  displayName: EXAMPLE_DISPLAY_NAME,
  pluralDisplayName: EXAMPLE_PLURAL_DISPLAY_NAME,
  customAttributes: EXAMPLE_CUSTOM_ATTRIBUTES,
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
  gitRepositoryOverride: false,
  licensed: true,
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true,
};

const FIND_ONE_RESOURCE_QUERY = gql`
  query ($id: String!) {
    resource(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      resourceType
      gitRepositoryOverride
      licensed
      entities {
        id
        createdAt
        updatedAt
        resourceId
        name
        displayName
        pluralDisplayName
        customAttributes
      }
      builds {
        id
        userId
        resourceId
        version
        actionId
        createdAt
        commitId
        status
        gitStatus
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
  query ($resourceId: String!, $entityId: String!) {
    resource(where: { id: $resourceId }) {
      entities(where: { id: { equals: $entityId } }) {
        id
        createdAt
        updatedAt
        resourceId
        name
        displayName
        pluralDisplayName
        customAttributes
      }
    }
  }
`;

const FIND_MANY_BUILDS_QUERY = gql`
  query ($resourceId: String!) {
    resource(where: { id: $resourceId }) {
      builds {
        id
        userId
        resourceId
        version
        actionId
        createdAt
        commitId
        status
        gitStatus
      }
    }
  }
`;

const FIND_MANY_ENVIRONMENTS_QUERY = gql`
  query ($resourceId: String!) {
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

const CREATE_SERVICE_MUTATION = gql`
  mutation ($data: ResourceCreateInput!) {
    createService(data: $data) {
      id
      createdAt
      updatedAt
      name
      description
      resourceType
      gitRepositoryOverride
      licensed
      entities {
        id
        createdAt
        updatedAt
        resourceId
        name
        displayName
        pluralDisplayName
        customAttributes
      }
      builds {
        id
        userId
        resourceId
        version
        actionId
        createdAt
        commitId
        status
        gitStatus
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
  mutation ($id: String!) {
    deleteResource(where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      resourceType
      gitRepositoryOverride
      licensed
      entities {
        id
        createdAt
        updatedAt
        resourceId
        name
        displayName
        pluralDisplayName
        customAttributes
      }
      builds {
        id
        userId
        resourceId
        version
        actionId
        createdAt
        commitId
        status
        gitStatus
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
  mutation ($name: String!, $id: String!) {
    updateResource(data: { name: $name }, where: { id: $id }) {
      id
      createdAt
      updatedAt
      name
      description
      resourceType
      gitRepositoryOverride
      licensed
      entities {
        id
        createdAt
        updatedAt
        resourceId
        name
        displayName
        pluralDisplayName
        customAttributes
      }
      builds {
        id
        userId
        resourceId
        version
        actionId
        createdAt
        commitId
        status
        gitStatus
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
const createServiceMock = jest.fn(() => {
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

const getServiceSettingsBlockMock = jest.fn(() => {
  return {
    id: "exampleServiceSettingsBlockId",
    createdAt: new Date(),
    updatedAt: new Date(),
    resource: EXAMPLE_RESOURCE,
    settings: {
      exampleSetting: "exampleValue",
    },
  };
});

const ownershipServiceGetOwnershipMock = jest.fn(() => ({
  id: "exampleOwnershipId",
  owner: EXAMPLE_USER,
  ownershipType: EnumOwnershipType.User,
}));

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

describe("ResourceResolver", () => {
  let app: INestApplication;
  let apolloClient: ApolloServerBase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceResolver,
        {
          provide: ResourceService,
          useClass: jest.fn(() => ({
            resource: resourceMock,
            createService: createServiceMock,
            deleteResource: deleteResourceMock,
            updateResource: updateResourceMock,
          })),
        },
        {
          provide: ProjectService,
          useClass: jest.fn(() => ({
            findUnique: jest.fn(() => ({})),
          })),
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUser: userServiceFindUserMock,
          })),
        },
        {
          provide: BlueprintService,
          useClass: jest.fn(() => ({
            blueprint: jest.fn(),
          })),
        },
        {
          provide: RelationService,
          useClass: jest.fn(() => ({
            findMany: jest.fn(),
          })),
        },
        {
          provide: EntityService,
          useClass: jest.fn(() => ({
            entities: entitiesMock,
          })),
        },
        {
          provide: ResourceVersionService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: BuildService,
          useClass: jest.fn(() => ({
            findMany: findManyBuildMock,
          })),
        },
        {
          provide: ServiceSettingsService,
          useClass: jest.fn(() => ({
            getServiceSettingsBlock: getServiceSettingsBlockMock,
          })),
        },
        {
          provide: AmplicationLogger,
          useClass: jest.fn(() => ({
            error: jest.fn(),
          })),
        },
        {
          provide: EnvironmentService,
          useClass: jest.fn(() => ({
            findMany: findManyEnvironmentsMock,
          })),
        },
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({})),
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: jest.fn(),
          })),
        },
        {
          provide: OwnershipService,
          useClass: jest.fn(() => ({
            getOwnership: ownershipServiceGetOwnershipMock,
          })),
        },
        {
          provide: ResourceSettingsService,
          useClass: jest.fn(() => ({})),
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

  it("should find one resource", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_ONE_RESOURCE_QUERY,
      variables: { id: EXAMPLE_RESOURCE_ID },
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
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
          },
        ],
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString(),
          },
        ],
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString(),
          },
        ],
      },
    });
    expect(resourceMock).toHaveBeenCalledTimes(1);
    expect(resourceMock).toHaveBeenCalledWith(args);
  });

  it("should find many entities", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_MANY_ENTITIES_QUERY,
      variables: {
        resourceId: EXAMPLE_RESOURCE_ID,
        entityId: EXAMPLE_ENTITY_ID,
      },
    });
    const args = {
      where: {
        id: { equals: EXAMPLE_ENTITY_ID },
        resource: { id: EXAMPLE_RESOURCE_ID },
      },
    };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      resource: {
        entities: [
          {
            ...EXAMPLE_ENTITY,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
          },
        ],
      },
    });
    expect(entitiesMock).toHaveBeenCalledTimes(1);
    expect(entitiesMock).toHaveBeenCalledWith(args);
  });

  it("should find many builds", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_MANY_BUILDS_QUERY,
      variables: { resourceId: EXAMPLE_RESOURCE_ID },
    });
    const args = {
      where: { resource: { id: EXAMPLE_RESOURCE_ID } },
    };
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      resource: {
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString(),
          },
        ],
      },
    });
    expect(findManyBuildMock).toHaveBeenCalledTimes(1);
    expect(findManyBuildMock).toHaveBeenCalledWith(args);
  });

  it("should find many environments", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_MANY_ENVIRONMENTS_QUERY,
      variables: { resourceId: EXAMPLE_RESOURCE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      resource: {
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString(),
          },
        ],
      },
    });
    expect(findManyEnvironmentsMock).toHaveBeenCalledTimes(1);
    expect(findManyEnvironmentsMock).toHaveBeenCalledWith({
      where: { resource: { id: EXAMPLE_RESOURCE_ID } },
    });
  });

  it("should create a service", async () => {
    const resourceCreateInput: ResourceCreateInput = {
      name: EXAMPLE_NAME,
      description: EXAMPLE_DESCRIPTION,
      resourceType: EnumResourceType.Service,
      project: { connect: { id: EXAMPLE_PROJECT_ID } },
      codeGenerator: EnumCodeGenerator.NodeJs,
    };
    const res = await apolloClient.executeOperation({
      query: CREATE_SERVICE_MUTATION,
      variables: {
        data: resourceCreateInput,
      },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createService: {
        ...EXAMPLE_RESOURCE,
        resourceType: EnumResourceType.Service,
        createdAt: EXAMPLE_RESOURCE.createdAt.toISOString(),
        updatedAt: EXAMPLE_RESOURCE.updatedAt.toISOString(),
        entities: [
          {
            ...EXAMPLE_ENTITY,
            createdAt: EXAMPLE_ENTITY.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
          },
        ],
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString(),
          },
        ],
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString(),
          },
        ],
      },
    });
    expect(createServiceMock).toHaveBeenCalledTimes(1);
    expect(createServiceMock).toHaveBeenCalledWith(
      {
        data: resourceCreateInput,
      },
      EXAMPLE_USER
    );
  });

  it("should delete a resource", async () => {
    const res = await apolloClient.executeOperation({
      query: DELETE_RESOURCE_MUTATION,
      variables: {
        id: EXAMPLE_RESOURCE_ID,
      },
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
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
          },
        ],
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString(),
          },
        ],
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString(),
          },
        ],
      },
    });
    expect(deleteResourceMock).toHaveBeenCalledTimes(1);
    expect(deleteResourceMock).toHaveBeenCalledWith(
      {
        where: { id: EXAMPLE_RESOURCE_ID },
      },
      EXAMPLE_USER
    );
  });

  it("should update a resource", async () => {
    const res = await apolloClient.executeOperation({
      query: UPDATE_RESOURCE_MUTATION,
      variables: {
        name: EXAMPLE_NAME,
        id: EXAMPLE_RESOURCE_ID,
      },
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
            updatedAt: EXAMPLE_ENTITY.updatedAt.toISOString(),
          },
        ],
        builds: [
          {
            ...EXAMPLE_BUILD,
            createdAt: EXAMPLE_BUILD.createdAt.toISOString(),
          },
        ],
        environments: [
          {
            ...EXAMPLE_ENVIRONMENT,
            createdAt: EXAMPLE_ENVIRONMENT.createdAt.toISOString(),
            updatedAt: EXAMPLE_ENVIRONMENT.updatedAt.toISOString(),
          },
        ],
      },
    });
    expect(updateResourceMock).toHaveBeenCalledTimes(1);
    expect(updateResourceMock).toHaveBeenCalledWith(
      {
        data: { name: EXAMPLE_NAME },
        where: { id: EXAMPLE_RESOURCE_ID },
      },
      EXAMPLE_USER
    );
  });
});
