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
import { mockGqlAuthGuardCanActivate } from "../../../test/gql-auth-mock";
import { WorkspaceService } from "./workspace.service";
import { WorkspaceResolver } from "./workspace.resolver";
import { Resource, Workspace, User, Project } from "../../models";
import { Invitation } from "./dto/Invitation";
import { ResourceService } from "../resource/resource.service";
import { EnumResourceType } from "../../prisma";
import { ProjectService } from "../project/project.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { BillingService } from "../billing/billing.service";
import { SubscriptionService } from "../subscription/subscription.service";
import { ApolloServerBase } from "apollo-server-core";
import { UserService } from "../user/user.service";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";

const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_WORKSPACE_NAME = "exampleWorkspaceName";

const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_RESOURCE_NAME = "exampleResourceName";
const EXAMPLE_RESOURCE_DESCRIPTION = "exampleResourceDescription";

const EXAMPLE_EMAIL = "exampleEmail";
const timeNow = new Date();

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: timeNow,
  updatedAt: timeNow,
  isOwner: true,
};

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  name: EXAMPLE_WORKSPACE_NAME,
  createdAt: timeNow,
  updatedAt: timeNow,
  allowLLMFeatures: true,
};

const EXAMPLE_INVITATION: Invitation = {
  id: EXAMPLE_RESOURCE_ID,
  email: "example@email.com",
  createdAt: timeNow,
  updatedAt: timeNow,
};

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  resourceType: EnumResourceType.Service,
  name: EXAMPLE_RESOURCE_NAME,
  description: EXAMPLE_RESOURCE_DESCRIPTION,
  createdAt: timeNow,
  updatedAt: timeNow,
  gitRepositoryOverride: false,
  licensed: true,
};

const EXAMPLE_PROJECT: Project = {
  id: EXAMPLE_RESOURCE_ID,
  name: EXAMPLE_RESOURCE_NAME,
  createdAt: timeNow,
  updatedAt: timeNow,
  useDemoRepo: false,
  demoRepoName: null,
  licensed: true,
};

const GET_WORKSPACE_QUERY = gql`
  query ($id: String!) {
    workspace(where: { id: $id }) {
      id
      name
      allowLLMFeatures
      createdAt
      updatedAt
    }
  }
`;

const GET_PROJECT_QUERY = gql`
  query ($id: String!) {
    workspace(where: { id: $id }) {
      projects {
        id
        name
        createdAt
        updatedAt
        useDemoRepo
        demoRepoName
        licensed
      }
    }
  }
`;

const DELETE_WORKSPACE_MUTATION = gql`
  mutation ($id: String!) {
    deleteWorkspace(where: { id: $id }) {
      id
      name
      allowLLMFeatures
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_WORKSPACE_MUTATION = gql`
  mutation ($id: String!) {
    updateWorkspace(data: {}, where: { id: $id }) {
      id
      name
      allowLLMFeatures
      createdAt
      updatedAt
    }
  }
`;

const INVITE_USER_MUTATION = gql`
  mutation ($email: String!) {
    inviteUser(data: { email: $email }) {
      id
      email
      createdAt
      updatedAt
    }
  }
`;

const workspaceServiceGetWorkspaceMock = jest.fn(() => EXAMPLE_WORKSPACE);
const workspaceServiceDeleteWorkspaceMock = jest.fn(() => EXAMPLE_WORKSPACE);
const workspaceServiceUpdateWorkspaceMock = jest.fn(() => EXAMPLE_WORKSPACE);
const workspaceServiceInviteUserMock = jest.fn(() => EXAMPLE_INVITATION);
const resourceServiceResourcesMock = jest.fn(() => [EXAMPLE_RESOURCE]);
const projectServiceProjectsMock = jest.fn(() => [EXAMPLE_PROJECT]);

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));

describe("WorkspaceResolver", () => {
  let app: INestApplication;
  let apolloClient: ApolloServerBase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceResolver,
        {
          provide: BillingService,
          useValue: {
            getMeteredEntitlement: jest.fn(() => {
              return {};
            }),
            getNumericEntitlement: jest.fn(() => {
              return {};
            }),
          },
        },
        {
          provide: WorkspaceService,
          useClass: jest.fn(() => ({
            getWorkspace: workspaceServiceGetWorkspaceMock,
            deleteWorkspace: workspaceServiceDeleteWorkspaceMock,
            updateWorkspace: workspaceServiceUpdateWorkspaceMock,
            inviteUser: workspaceServiceInviteUserMock,
          })),
        },
        {
          provide: ResourceService,
          useClass: jest.fn(() => ({
            resources: resourceServiceResourcesMock,
          })),
        },
        {
          provide: ProjectService,
          useClass: jest.fn(() => ({
            findProjects: projectServiceProjectsMock,
          })),
        },
        {
          provide: SubscriptionService,
          useClass: jest.fn(() => ({
            resolveSubscription: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
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
        MockedSegmentAnalyticsProvider(),
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            setLastActivity: jest.fn(),
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

  it("should get an workspace", async () => {
    const res = await apolloClient.executeOperation({
      query: GET_WORKSPACE_QUERY,
      variables: { id: EXAMPLE_WORKSPACE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data.workspace.id).toEqual(EXAMPLE_WORKSPACE.id);
    expect(res.data.workspace.name).toEqual(EXAMPLE_WORKSPACE.name);
    expect(workspaceServiceGetWorkspaceMock).toBeCalledTimes(1);
    expect(workspaceServiceGetWorkspaceMock).toBeCalledWith({
      where: { id: EXAMPLE_WORKSPACE_ID },
    });
  });

  it("should get workspace's projects", async () => {
    const res = await apolloClient.executeOperation({
      query: GET_PROJECT_QUERY,
      variables: { id: EXAMPLE_WORKSPACE_ID },
    });

    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      workspace: {
        projects: [
          {
            ...EXAMPLE_PROJECT,
            createdAt: EXAMPLE_RESOURCE.createdAt.toISOString(),
            updatedAt: EXAMPLE_RESOURCE.updatedAt.toISOString(),
          },
        ],
      },
    });
    expect(projectServiceProjectsMock).toBeCalledTimes(1);
    expect(projectServiceProjectsMock).toBeCalledWith({
      where: { workspace: { id: EXAMPLE_WORKSPACE_ID } },
    });
  });

  it("should delete an workspace", async () => {
    const res = await apolloClient.executeOperation({
      query: DELETE_WORKSPACE_MUTATION,
      variables: { id: EXAMPLE_WORKSPACE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      deleteWorkspace: {
        ...EXAMPLE_WORKSPACE,
        createdAt: EXAMPLE_WORKSPACE.createdAt.toISOString(),
        updatedAt: EXAMPLE_WORKSPACE.updatedAt.toISOString(),
      },
    });
    expect(workspaceServiceDeleteWorkspaceMock).toBeCalledTimes(1);
    expect(workspaceServiceDeleteWorkspaceMock).toBeCalledWith({
      where: { id: EXAMPLE_WORKSPACE_ID },
    });
  });

  it("should update an workspace", async () => {
    const res = await apolloClient.executeOperation({
      query: UPDATE_WORKSPACE_MUTATION,
      variables: { id: EXAMPLE_WORKSPACE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      updateWorkspace: {
        ...EXAMPLE_WORKSPACE,
        createdAt: EXAMPLE_WORKSPACE.createdAt.toISOString(),
        updatedAt: EXAMPLE_WORKSPACE.updatedAt.toISOString(),
      },
    });
    expect(workspaceServiceUpdateWorkspaceMock).toBeCalledTimes(1);
    expect(workspaceServiceUpdateWorkspaceMock).toBeCalledWith({
      data: {},
      where: { id: EXAMPLE_WORKSPACE_ID },
    });
  });

  it("should invite a user", async () => {
    const res = await apolloClient.executeOperation({
      query: INVITE_USER_MUTATION,
      variables: { email: EXAMPLE_EMAIL },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      inviteUser: {
        ...EXAMPLE_INVITATION,
        createdAt: EXAMPLE_USER.createdAt.toISOString(),
        updatedAt: EXAMPLE_USER.updatedAt.toISOString(),
      },
    });
    expect(workspaceServiceInviteUserMock).toBeCalledTimes(1);
    expect(workspaceServiceInviteUserMock).toBeCalledWith(EXAMPLE_USER, {
      data: { email: EXAMPLE_EMAIL },
    });
  });
});
