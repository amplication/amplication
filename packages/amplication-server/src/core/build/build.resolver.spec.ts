import { Test, TestingModule } from "@nestjs/testing";
import {
  ApolloDriver,
  ApolloDriverConfig,
  getApolloServer,
} from "@nestjs/apollo";
import { gql } from "apollo-server-express";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { INestApplication } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigService } from "@nestjs/config";
import { BuildResolver } from "./build.resolver";
import { BuildService } from "./build.service";
import { ActionService } from "../action/action.service";
import { UserService } from "../user/user.service";
import { Build } from "./dto/Build";
import { Commit, Resource, User } from "../../models";
import { Action } from "../action/dto";
import { EnumBuildStatus } from "./dto/EnumBuildStatus";
import { CommitService } from "../commit/commit.service";
import { EnumResourceType } from "@amplication/code-gen-types/models";
import { ResourceService } from "../resource/resource.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { ApolloServerBase } from "apollo-server-core";

const EXAMPLE_BUILD_ID = "exampleBuildId";
const EXAMPLE_COMMIT_ID = "exampleCommitId";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_VERSION = "exampleVersion";
const EXAMPLE_ACTION_ID = "exampleActionId";
const EXAMPLE_MESSAGE = "exampleMessage";

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true,
};

const EXAMPLE_ACTION: Action = {
  id: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
};

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  createdAt: new Date(),
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE,
};

const EXAMPLE_BUILD: Build = {
  id: EXAMPLE_BUILD_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  userId: EXAMPLE_USER_ID,
  version: EXAMPLE_VERSION,
  actionId: EXAMPLE_ACTION_ID,
  createdAt: new Date(),
  commitId: EXAMPLE_COMMIT_ID,
};

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  resourceType: EnumResourceType.Service,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "exampleName",
  description: "exampleDescription",
  builds: [EXAMPLE_BUILD],
  gitRepositoryOverride: false,
};

const FIND_MANY_BUILDS_QUERY = gql`
  query {
    builds {
      id
      resourceId
      userId
      version
      actionId
      createdAt
      commitId
    }
  }
`;

const FIND_ONE_BUILD_QUERY = gql`
  query ($id: String!) {
    build(where: { id: $id }) {
      id
      resourceId
      userId
      version
      actionId
      createdAt
      commitId
    }
  }
`;

const FIND_USER_QUERY = gql`
  query ($id: String!) {
    build(where: { id: $id }) {
      createdBy {
        id
        createdAt
        updatedAt
        isOwner
      }
    }
  }
`;

const FIND_ACTION_QUERY = gql`
  query ($id: String!) {
    build(where: { id: $id }) {
      action {
        id
        createdAt
      }
    }
  }
`;

const ARCHIVE_URI_QUERY = gql`
  query ($id: String!) {
    build(where: { id: $id }) {
      archiveURI
    }
  }
`;

const BUILD_STATUS_QUERY = gql`
  query ($id: String!) {
    build(where: { id: $id }) {
      status
    }
  }
`;

const CREATE_BUILD_MUTATION = gql`
  mutation ($resourceId: String!, $commitId: String!, $message: String!) {
    createBuild(
      data: {
        resource: { connect: { id: $resourceId } }
        commit: { connect: { id: $commitId } }
        message: $message
      }
    ) {
      id
      resourceId
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
const commitServiceFindOneMock = jest.fn(() => EXAMPLE_COMMIT);
const resourceServiceFindOneMock = jest.fn(() => EXAMPLE_RESOURCE);

const buildServiceCalcBuildStatusMock = jest.fn(() => {
  return EnumBuildStatus.Completed;
});

const mockCanActivate = jest.fn(() => true);

describe("BuildResolver", () => {
  let app: INestApplication;
  let apolloClient: ApolloServerBase;

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
            create: buildServiceCreateMock,
          })),
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUser: userServiceFindUserMock,
          })),
        },
        {
          provide: ActionService,
          useClass: jest.fn(() => ({
            findOne: actionServiceFindOneMock,
          })),
        },
        {
          provide: CommitService,
          useClass: jest.fn(() => ({
            findOne: commitServiceFindOneMock,
          })),
        },
        {
          provide: ResourceService,
          useClass: jest.fn(() => ({
            findOne: resourceServiceFindOneMock,
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

  it("should find many builds", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_MANY_BUILDS_QUERY,
      variables: {},
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      builds: [
        {
          ...EXAMPLE_BUILD,
          createdAt: EXAMPLE_BUILD.createdAt.toISOString(),
        },
      ],
    });
    expect(buildServiceFindManyMock).toBeCalledTimes(1);
    expect(buildServiceFindManyMock).toBeCalledWith({});
  });

  it("should find one build", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_ONE_BUILD_QUERY,
      variables: { id: EXAMPLE_BUILD_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        ...EXAMPLE_BUILD,
        createdAt: EXAMPLE_BUILD.createdAt.toISOString(),
      },
    });
    expect(buildServiceFindOneMock).toBeCalledTimes(1);
    expect(buildServiceFindOneMock).toBeCalledWith({
      where: { id: EXAMPLE_BUILD_ID },
    });
  });

  it("should find a builds creating user", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_USER_QUERY,
      variables: { id: EXAMPLE_BUILD_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        createdBy: {
          ...EXAMPLE_USER,
          createdAt: EXAMPLE_USER.createdAt.toISOString(),
          updatedAt: EXAMPLE_USER.updatedAt.toISOString(),
          isOwner: true,
        },
      },
    });
    expect(userServiceFindUserMock).toBeCalledTimes(1);
    expect(userServiceFindUserMock).toBeCalledWith(
      {
        where: { id: EXAMPLE_USER_ID },
      },
      true
    );
  });

  it("should find a builds action", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_ACTION_QUERY,
      variables: { id: EXAMPLE_BUILD_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        action: {
          ...EXAMPLE_ACTION,
          createdAt: EXAMPLE_ACTION.createdAt.toISOString(),
        },
      },
    });
    expect(actionServiceFindOneMock).toBeCalledTimes(1);
    expect(actionServiceFindOneMock).toBeCalledWith({
      where: { id: EXAMPLE_ACTION_ID },
    });
  });

  it("should return the build archive URI", async () => {
    const res = await apolloClient.executeOperation({
      query: ARCHIVE_URI_QUERY,
      variables: { id: EXAMPLE_BUILD_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        archiveURI: `/generated-apps/${EXAMPLE_BUILD_ID}.zip`,
      },
    });
  });

  it("should get a build status", async () => {
    const res = await apolloClient.executeOperation({
      query: BUILD_STATUS_QUERY,
      variables: { id: EXAMPLE_BUILD_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      build: {
        status: EnumBuildStatus.Completed,
      },
    });
    expect(buildServiceCalcBuildStatusMock).toBeCalledTimes(1);
    expect(buildServiceCalcBuildStatusMock).toBeCalledWith(EXAMPLE_BUILD_ID);
  });

  it("should create a build", async () => {
    const args = {
      data: {
        resource: { connect: { id: EXAMPLE_RESOURCE_ID } },
        commit: { connect: { id: EXAMPLE_COMMIT_ID } },
        message: EXAMPLE_MESSAGE,
      },
    };
    const res = await apolloClient.executeOperation({
      query: CREATE_BUILD_MUTATION,
      variables: {
        resourceId: EXAMPLE_RESOURCE_ID,
        commitId: EXAMPLE_COMMIT_ID,
        message: EXAMPLE_MESSAGE,
      },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      createBuild: {
        ...EXAMPLE_BUILD,
        createdAt: EXAMPLE_BUILD.createdAt.toISOString(),
      },
    });
    expect(buildServiceCreateMock).toBeCalledTimes(1);
    expect(buildServiceCreateMock).toBeCalledWith(args);
  });
});
