import { INestApplication } from "@nestjs/common";
import { ApolloServerBase } from "apollo-server-core";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Test } from "@nestjs/testing";
import { UserActionResolver } from "./userAction.resolver";
import { UserActionService } from "./userAction.service";
import { ActionService } from "../action/action.service";
import { Resource, User } from "../../models";
import { Action } from "../action/dto";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { Build } from "../build/dto/Build";
import { UserService } from "../user/user.service";
import { ResourceService } from "../resource/resource.service";
import {
  ApolloDriver,
  ApolloDriverConfig,
  getApolloServer,
} from "@nestjs/apollo";
import { gql } from "apollo-server-express";
import { UserAction } from "./dto";
import { EnumUserActionType } from "../../prisma";
import { ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { EnumUserActionStatus } from "./types";

const EXAMPLE_USER_ACTION_ID = "exampleUserActionId";
const EXAMPLE_BUILD_ID = "exampleBuildId";
const EXAMPLE_COMMIT_ID = "exampleCommitId";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_VERSION = "exampleVersion";
const EXAMPLE_ACTION_ID = "exampleActionId";

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

const EXAMPLE_USER_ACTION: UserAction = {
  id: EXAMPLE_USER_ACTION_ID,
  resourceId: EXAMPLE_RESOURCE_ID,
  userId: EXAMPLE_USER_ID,
  actionId: EXAMPLE_ACTION_ID,
  userActionType: EnumUserActionType.DBSchemaImport,
  metadata: {},
  createdAt: new Date(),
  updatedAt: new Date(),
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

const userActionServiceFindOneMock = jest.fn(() => EXAMPLE_USER_ACTION);
const userServiceFindUserMock = jest.fn(() => EXAMPLE_USER);
const actionServiceFindOneMock = jest.fn(() => EXAMPLE_ACTION);
const resourceServiceFindOneMock = jest.fn(() => EXAMPLE_RESOURCE);

const userActionServiceCalcUserActionStatusMock = jest.fn(() => {
  return EnumUserActionStatus.Completed;
});

const mockCanActivate = jest.fn(() => true);

const FIND_ONE_USER_ACTION_QUERY = gql`
  query ($id: String!) {
    userAction(where: { id: $id }) {
      id
      createdAt
      updatedAt
      userId
      resourceId
      actionId
      userActionType
      metadata
    }
  }
`;

const USER_ACTION_STATUS_QUERY = gql`
  query ($id: String!) {
    userAction(where: { id: $id }) {
      status
    }
  }
`;

const FIND_ACTION_QUERY = gql`
  query ($id: String!) {
    userAction(where: { id: $id }) {
      action {
        id
        createdAt
      }
    }
  }
`;

describe("userActionResolver", () => {
  let app: INestApplication;
  let apolloClient: ApolloServerBase;

  beforeAll(async () => {
    jest.clearAllMocks();

    const module = await Test.createTestingModule({
      imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
          autoSchemaFile: true,
          driver: ApolloDriver,
        }),
      ],
      providers: [
        UserActionResolver,
        MockedAmplicationLoggerProvider,
        {
          provide: UserActionService,
          useClass: jest.fn(() => ({
            findOne: userActionServiceFindOneMock,
            calcUserActionStatus: userActionServiceCalcUserActionStatusMock,
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
          provide: ResourceService,
          useClass: jest.fn(() => ({
            findOne: resourceServiceFindOneMock,
          })),
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: jest.fn(),
          })),
        },
      ],
    })
      .overrideGuard(GqlAuthGuard)
      .useValue({ canActivate: mockCanActivate })
      .compile();

    app = module.createNestApplication();
    await app.init();
    apolloClient = getApolloServer(app);
  });

  it("should find one user action", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_ONE_USER_ACTION_QUERY,
      variables: { id: EXAMPLE_USER_ACTION_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      userAction: {
        ...EXAMPLE_USER_ACTION,
        createdAt: EXAMPLE_USER_ACTION.createdAt.toISOString(),
        updatedAt: EXAMPLE_USER_ACTION.updatedAt.toISOString(),
      },
    });
    expect(userActionServiceFindOneMock).toBeCalledTimes(1);
    expect(userActionServiceFindOneMock).toBeCalledWith({
      where: { id: EXAMPLE_USER_ACTION_ID },
    });
  });

  it("should get a user action status", async () => {
    const res = await apolloClient.executeOperation({
      query: USER_ACTION_STATUS_QUERY,
      variables: { id: EXAMPLE_USER_ACTION_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      userAction: {
        status: EnumUserActionStatus.Completed,
      },
    });
    expect(userActionServiceCalcUserActionStatusMock).toBeCalledTimes(1);
    expect(userActionServiceCalcUserActionStatusMock).toBeCalledWith(
      EXAMPLE_USER_ACTION_ID
    );
  });

  it("should find a user action action", async () => {
    const res = await apolloClient.executeOperation({
      query: FIND_ACTION_QUERY,
      variables: { id: EXAMPLE_USER_ACTION_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      userAction: {
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
});
