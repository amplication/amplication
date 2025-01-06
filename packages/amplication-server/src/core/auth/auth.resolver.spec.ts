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
import { Account, Auth, User, Workspace } from "../../models";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { PermissionsService } from "../permissions/permissions.service";
import { AuthUser } from "./types";
import { RolesPermissions } from "@amplication/util-roles-types";

const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_TOKEN = "exampleToken";
const EXAMPLE_ACCOUNT_ID = "exampleAccountId";
const EXAMPLE_EMAIL = "exampleEmail";
const EXAMPLE_FIRST_NAME = "exampleFirstName";
const EXAMPLE_LAST_NAME = "exampleLastName";
const EXAMPLE_PASSWORD = "examplePassword";
const EXAMPLE_WORKSPACE_NAME = "exampleWorkspaceName";
const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ACCOUNT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD,
};

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  name: "Example Workspace",
  createdAt: new Date(),
  updatedAt: new Date(),
  allowLLMFeatures: true,
};

const EXAMPLE_USER: AuthUser = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  account: EXAMPLE_ACCOUNT,
  isOwner: true,
  permissions: ["git.org.create", "git.org.delete"],

  workspace: EXAMPLE_WORKSPACE,
};

const EXAMPLE_USER_WITHOUT_ACCOUNT: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: false,
};

const EXAMPLE_AUTH: Auth = {
  token: EXAMPLE_TOKEN,
};

const SIGNUP_MUTATION = gql`
  mutation (
    $email: String!
    $password: String!
    $firstName: String!
    $lastName: String!
    $workspaceName: String!
  ) {
    signup(
      data: {
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
        workspaceName: $workspaceName
      }
    ) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      token
    }
  }
`;

const CHANGE_PASSWORD_MUTATION = gql`
  mutation ($oldPassword: String!, $newPassword: String!) {
    changePassword(
      data: { oldPassword: $oldPassword, newPassword: $newPassword }
    ) {
      id
      createdAt
      updatedAt
      email
      firstName
      lastName
      password
    }
  }
`;

const SET_WORKSPACE_MUTATION = gql`
  mutation ($id: String!) {
    setCurrentWorkspace(data: { id: $id }) {
      token
    }
  }
`;

const ME_QUERY = gql`
  query {
    me {
      id
      createdAt
      updatedAt
    }
  }
`;

const GET_PERMISSIONS = gql`
  query {
    permissions
  }
`;

const GET_RESOURCE_PERMISSIONS = gql`
  query ($resourceId: String!) {
    resourcePermissions(where: { id: $resourceId })
  }
`;

const authServiceSignUpMock = jest.fn(() => EXAMPLE_TOKEN);
const authServiceLoginMock = jest.fn(() => EXAMPLE_TOKEN);
const authServiceChangePasswordMock = jest.fn(() => EXAMPLE_ACCOUNT);
const setCurrentWorkspaceMock = jest.fn(() => EXAMPLE_TOKEN);

const mockCanActivate = jest.fn(mockGqlAuthGuardCanActivate(EXAMPLE_USER));
const mockGetUserResourceOrProjectPermissions = jest.fn(
  (): RolesPermissions[] => ["resource.create", "resource.createTemplate"]
);

describe("AuthResolver", () => {
  let app: INestApplication;
  let apolloClient: ApolloServerBase;

  beforeEach(async () => {
    jest.clearAllMocks();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useClass: jest.fn(() => ({
            signup: authServiceSignUpMock,
            login: authServiceLoginMock,
            changePassword: authServiceChangePasswordMock,
            setCurrentWorkspace: setCurrentWorkspaceMock,
          })),
        },
        {
          provide: PermissionsService,
          useClass: jest.fn(() => ({
            getUserResourceOrProjectPermissions:
              mockGetUserResourceOrProjectPermissions,
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

  it("should return current user", async () => {
    const res = await apolloClient.executeOperation({
      query: ME_QUERY,
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      me: {
        id: EXAMPLE_USER.id,
        createdAt: EXAMPLE_USER.createdAt.toISOString(),
        updatedAt: EXAMPLE_USER.updatedAt.toISOString(),
      },
    });
  });

  it("should signup", async () => {
    const variables = {
      email: EXAMPLE_EMAIL,
      password: EXAMPLE_PASSWORD,
      firstName: EXAMPLE_FIRST_NAME,
      lastName: EXAMPLE_LAST_NAME,
      workspaceName: EXAMPLE_WORKSPACE_NAME,
    };
    const res = await apolloClient.executeOperation({
      query: SIGNUP_MUTATION,
      variables: variables,
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      signup: {
        ...EXAMPLE_AUTH,
      },
    });
    expect(authServiceSignUpMock).toHaveBeenCalledTimes(1);
    expect(authServiceSignUpMock).toHaveBeenCalledWith({
      ...variables,
      email: variables.email.toLowerCase(),
    });
  });

  it("should login", async () => {
    const variables = {
      email: EXAMPLE_EMAIL,
      password: EXAMPLE_PASSWORD,
    };
    const res = await apolloClient.executeOperation({
      query: LOGIN_MUTATION,
      variables: variables,
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      login: {
        ...EXAMPLE_AUTH,
      },
    });
    expect(authServiceLoginMock).toHaveBeenCalledTimes(1);
    expect(authServiceLoginMock).toHaveBeenCalledWith(
      EXAMPLE_EMAIL.toLowerCase(),
      EXAMPLE_PASSWORD
    );
  });

  it("should change a password", async () => {
    const res = await apolloClient.executeOperation({
      query: CHANGE_PASSWORD_MUTATION,
      variables: {
        oldPassword: EXAMPLE_PASSWORD,
        newPassword: EXAMPLE_PASSWORD,
      },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      changePassword: {
        ...EXAMPLE_ACCOUNT,
        createdAt: EXAMPLE_ACCOUNT.createdAt.toISOString(),
        updatedAt: EXAMPLE_ACCOUNT.updatedAt.toISOString(),
      },
    });
    expect(authServiceChangePasswordMock).toHaveBeenCalledTimes(1);
    expect(authServiceChangePasswordMock).toHaveBeenCalledWith(
      EXAMPLE_USER.account,
      EXAMPLE_PASSWORD,
      EXAMPLE_PASSWORD
    );
  });

  it("set set the current workspace", async () => {
    const res = await apolloClient.executeOperation({
      query: SET_WORKSPACE_MUTATION,
      variables: { id: EXAMPLE_WORKSPACE_ID },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      setCurrentWorkspace: {
        ...EXAMPLE_AUTH,
      },
    });
    expect(setCurrentWorkspaceMock).toHaveBeenCalledTimes(1);
    expect(setCurrentWorkspaceMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT_ID,
      EXAMPLE_WORKSPACE_ID
    );
  });

  it("should throw error if user has no account", async () => {
    mockCanActivate.mockImplementation(
      mockGqlAuthGuardCanActivate(EXAMPLE_USER_WITHOUT_ACCOUNT)
    );
    const { data, errors } = await apolloClient.executeOperation({
      query: SET_WORKSPACE_MUTATION,
      variables: { id: EXAMPLE_WORKSPACE_ID },
    });

    expect(data).toEqual(null); //make sure no data is forward
    expect(errors.length === 1); // make sure only one error is send
    const error = errors[0];
    expect(error.message === "User has no account"); // make sure the error message is valid
    expect(setCurrentWorkspaceMock).toHaveBeenCalledTimes(0);
  });

  it("get user permissions", async () => {
    const res = await apolloClient.executeOperation({
      query: GET_PERMISSIONS,
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      permissions: ["git.org.create", "git.org.delete"],
    });
  });

  it("get resource permissions", async () => {
    const resourceId = "resourceId";
    const res = await apolloClient.executeOperation({
      query: GET_RESOURCE_PERMISSIONS,
      variables: { resourceId },
    });
    expect(res.errors).toBeUndefined();
    expect(res.data).toEqual({
      resourcePermissions: ["resource.create", "resource.createTemplate"],
    });
    expect(mockGetUserResourceOrProjectPermissions).toHaveBeenCalledTimes(1);
    expect(mockGetUserResourceOrProjectPermissions).toHaveBeenCalledWith(
      EXAMPLE_USER,
      resourceId,
      undefined
    );
  });
});
