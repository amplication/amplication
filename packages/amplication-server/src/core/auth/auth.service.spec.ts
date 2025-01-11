import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { Response } from "express";
import { Env } from "../../env";
import { Account, Project, User, Workspace } from "../../models";
import { PrismaService } from "../../prisma";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";
import { AccountService } from "../account/account.service";
import { PasswordService } from "../account/password.service";
import { Auth0Service } from "../idp/auth0.service";
import { UserService } from "../user/user.service";
import { WorkspaceService } from "../workspace/workspace.service";
import { AuthService } from "./auth.service";
import { IdentityProvider } from "./auth.types";
import { EnumTokenType } from "./dto";
import { AuthProfile, AuthUser } from "./types";
import { RolesPermissions } from "@amplication/util-roles-types";

const EXAMPLE_TOKEN = "EXAMPLE TOKEN";

const EXAMPLE_ACCOUNT: Account = {
  id: "alice",
  email: "example@amplication.com",
  password: "PASSWORD",
  firstName: "Alice",
  lastName: "Appleseed",
  createdAt: new Date(),
  updatedAt: new Date(),
  githubId: null,
};

const EXAMPLE_PROJECT: Project = {
  id: "exampleId",
  name: "Example name",
  workspaceId: "ExampleWorkspaceId",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  useDemoRepo: false,
  demoRepoName: null,
  licensed: true,
};

const EXAMPLE_HASHED_PASSWORD = "HASHED PASSWORD";
const EXAMPLE_NEW_PASSWORD = "NEW PASSWORD";
const EXAMPLE_NEW_HASHED_PASSWORD = "NEW HASHED PASSWORD";

const EXAMPLE_WORKSPACE_ID = "EXAMPLE_WORKSPACE_ID";

const urlQueryParamExample = "https://server.amplication.com?complete-signup=0";

const EXAMPLE_USER: User = {
  id: "exampleUser",
  createdAt: new Date(),
  updatedAt: new Date(),
  account: EXAMPLE_ACCOUNT,
  isOwner: true,
  lastActive: null,
};

const EXAMPLE_WORKSPACE: Workspace & { users: User[] } = {
  id: EXAMPLE_WORKSPACE_ID,
  name: "Example Workspace",
  createdAt: new Date(),
  updatedAt: new Date(),
  users: [EXAMPLE_USER],
  allowLLMFeatures: true,
};

const EXAMPLE_OTHER_WORKSPACE: Workspace = {
  id: "exampleOtherWorkspace",
  name: "Example Other Workspace",
  createdAt: new Date(),
  updatedAt: new Date(),
  allowLLMFeatures: true,
};

const EXAMPLE_OTHER_USER: User = {
  id: "exampleOtherUser",
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true,
  lastActive: null,
};

const EXAMPLE_PERMISSIONS: RolesPermissions[] = [
  "git.org.create",
  "git.org.delete",
  "privatePlugin.delete",
];

const EXAMPLE_AUTH_USER: AuthUser = {
  ...EXAMPLE_USER,
  workspace: EXAMPLE_WORKSPACE,
  account: EXAMPLE_ACCOUNT,
  permissions: EXAMPLE_PERMISSIONS,
};

const EXAMPLE_OTHER_AUTH_USER: AuthUser = {
  ...EXAMPLE_OTHER_USER,
  workspace: EXAMPLE_OTHER_WORKSPACE,
  account: EXAMPLE_ACCOUNT,
  permissions: EXAMPLE_PERMISSIONS,
};

const EXAMPLE_ACCOUNT_WITH_CURRENT_USER: Account & { currentUser: User } = {
  ...EXAMPLE_ACCOUNT,
  currentUser: EXAMPLE_USER,
};

const EXAMPLE_ACCOUNT_WITH_CURRENT_USER_WITH_ROLES_AND_WORKSPACE: Account & {
  currentUser: AuthUser;
} = {
  ...EXAMPLE_ACCOUNT,
  currentUser: EXAMPLE_AUTH_USER,
};

const EXAMPLE_BUSINESS_EMAIL_IDP_CONNECTION_NAME = "business-users-local";
const expectedDomain = "amplication.com";

const signMock = jest.fn(() => EXAMPLE_TOKEN);

const createAccountMock = jest.fn();

const setCurrentUserMock = jest.fn(() => EXAMPLE_ACCOUNT_WITH_CURRENT_USER);

const prismaAccountFindOneMock = jest.fn(() => {
  return EXAMPLE_ACCOUNT_WITH_CURRENT_USER_WITH_ROLES_AND_WORKSPACE;
});

const setPasswordMock = jest.fn();
const findAccountMock = jest.fn();
const updateAccountMock = jest.fn();
const hashPasswordMock = jest.fn((password) => {
  switch (password) {
    case EXAMPLE_ACCOUNT.password:
      return EXAMPLE_HASHED_PASSWORD;
    case EXAMPLE_NEW_PASSWORD:
      return EXAMPLE_NEW_HASHED_PASSWORD;
  }
  throw new Error(`Unexpected password: "${password}"`);
});

const validatePasswordMock = jest.fn(() => true);

const getAuthUserMock = jest.fn().mockResolvedValue({
  ...EXAMPLE_AUTH_USER,
  account: {
    ...EXAMPLE_ACCOUNT,
  },
});
const findUsersMock = jest.fn().mockResolvedValue([EXAMPLE_OTHER_AUTH_USER]);

const createWorkspaceMock = jest.fn(() => ({
  ...EXAMPLE_WORKSPACE,
  users: [EXAMPLE_AUTH_USER],
}));

const auth0ServiceCreateUserMock = jest.fn(() => ({
  data: {
    email: EXAMPLE_ACCOUNT.email,
  },
}));
const auth0ServiceResetUserPasswordMock = jest.fn(() => ({
  data: "ok",
}));

const auth0ServiceGetUserByEmailMock = jest.fn(() => null);

const prismaCreateProjectMock = jest.fn(() => EXAMPLE_PROJECT);
const segmentAnalyticsIdentifyMock = jest.fn().mockResolvedValue(undefined);
const segmentAnalyticsTrackWithContextMock = jest
  .fn()
  .mockResolvedValue(undefined);
const segmentAnalyticsTrackManualMock = jest.fn().mockResolvedValue(undefined);

describe("AuthService", () => {
  let service: AuthService;
  const responseMock = {
    status: jest.fn((x) => responseMock),
    cookie: jest.fn(),
    redirect: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case Env.AUTH_ISSUER_CLIENT_DB_CONNECTION:
                  return EXAMPLE_BUSINESS_EMAIL_IDP_CONNECTION_NAME;
                case Env.CLIENT_HOST:
                  return `https://server.${expectedDomain}`;
                default:
                  return "";
              }
            },
          },
        },
        {
          provide: AccountService,
          useClass: jest.fn(() => ({
            createAccount: createAccountMock,
            setCurrentUser: setCurrentUserMock,
            setPassword: setPasswordMock,
            findAccount: findAccountMock,
            updateAccount: updateAccountMock,
          })),
        },
        {
          provide: PasswordService,
          useClass: jest.fn(() => ({
            hashPassword: hashPasswordMock,
            validatePassword: validatePasswordMock,
          })),
        },
        {
          provide: UserService,
          useClass: jest.fn(() => ({
            findUsers: findUsersMock,
            getAuthUser: getAuthUserMock,
          })),
        },
        {
          provide: Auth0Service,
          useClass: jest.fn(() => ({
            createUser: auth0ServiceCreateUserMock,
            resetUserPassword: auth0ServiceResetUserPasswordMock,
            getUserByEmail: auth0ServiceGetUserByEmailMock,
          })),
        },
        {
          provide: WorkspaceService,
          useClass: jest.fn(() => ({
            createWorkspace: createWorkspaceMock,
          })),
        },
        MockedAmplicationLoggerProvider,
        {
          provide: JwtService,
          useClass: jest.fn(() => ({
            sign: signMock,
          })),
        },
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            account: {
              findUnique: prismaAccountFindOneMock,
            },
            project: {
              create: prismaCreateProjectMock,
            },
          })),
        },
        MockedSegmentAnalyticsProvider({
          identifyMock: segmentAnalyticsIdentifyMock,
          trackWithContextMock: segmentAnalyticsTrackWithContextMock,
          trackManualMock: segmentAnalyticsTrackManualMock,
        }),
        AuthService,
      ],
      imports: [],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("sign ups for correct data", async () => {
    createAccountMock.mockResolvedValueOnce(EXAMPLE_ACCOUNT);
    const result = await service.signup({
      email: EXAMPLE_ACCOUNT.email,
      password: EXAMPLE_ACCOUNT.password,
      firstName: EXAMPLE_ACCOUNT.firstName,
      lastName: EXAMPLE_ACCOUNT.lastName,
      workspaceName: EXAMPLE_WORKSPACE.name,
    });

    expect(result).toBe(EXAMPLE_TOKEN);
    expect(createAccountMock).toHaveBeenCalledTimes(1);
    expect(createAccountMock).toHaveBeenCalledWith(
      {
        data: {
          email: EXAMPLE_ACCOUNT.email,
          password: EXAMPLE_HASHED_PASSWORD,
          firstName: EXAMPLE_ACCOUNT.firstName,
          lastName: EXAMPLE_ACCOUNT.lastName,
        },
      },
      { identityProvider: IdentityProvider.Local }
    );
    expect(setCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(setCurrentUserMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_USER.id
    );
    expect(hashPasswordMock).toHaveBeenCalledTimes(1);
    expect(hashPasswordMock).toHaveBeenCalledWith(EXAMPLE_ACCOUNT.password);
    expect(createWorkspaceMock).toHaveBeenCalledTimes(1);
    expect(createWorkspaceMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      {
        data: {
          name: EXAMPLE_WORKSPACE.name,
        },
        include: {
          users: {
            include: {
              account: true,
              workspace: true,
            },
          },
        },
      },
      true,
      undefined,
      true
    );
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      workspaceId: EXAMPLE_WORKSPACE.id,
      roles: [],
      permissions: ["*"],
      userId: EXAMPLE_USER.id,
      type: EnumTokenType.User,
    });
  });

  it("login for existing user", async () => {
    const result = await service.login(
      EXAMPLE_ACCOUNT.email,
      EXAMPLE_ACCOUNT.password
    );
    expect(result).toBe(EXAMPLE_TOKEN);
    expect(prismaAccountFindOneMock).toHaveBeenCalledTimes(1);
    expect(prismaAccountFindOneMock).toHaveBeenCalledWith({
      where: {
        email: EXAMPLE_ACCOUNT.email,
      },
      include: {
        currentUser: {
          include: { account: true, workspace: true },
        },
      },
    });
    expect(validatePasswordMock).toHaveBeenCalledTimes(1);
    expect(validatePasswordMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.password,
      EXAMPLE_ACCOUNT.password
    );
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      workspaceId: EXAMPLE_WORKSPACE.id,
      permissions: EXAMPLE_PERMISSIONS,
      roles: [],
      userId: EXAMPLE_USER.id,
      type: EnumTokenType.User,
    });
  });

  it("sets current workspace for existing user and existing workspace", async () => {
    getAuthUserMock.mockResolvedValueOnce(EXAMPLE_OTHER_AUTH_USER);

    const result = await service.setCurrentWorkspace(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_OTHER_WORKSPACE.id
    );

    expect(result).toBe(EXAMPLE_TOKEN);

    expect(setCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(setCurrentUserMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_OTHER_AUTH_USER.id
    );
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      workspaceId: EXAMPLE_OTHER_WORKSPACE.id,
      permissions: EXAMPLE_PERMISSIONS,
      roles: [],
      userId: EXAMPLE_OTHER_AUTH_USER.id,
      type: EnumTokenType.User,
    });
  });

  it("changes password for existing account", async () => {
    await service.changePassword(
      EXAMPLE_ACCOUNT,
      EXAMPLE_ACCOUNT.password,
      EXAMPLE_NEW_PASSWORD
    );
    expect(validatePasswordMock).toHaveBeenCalledTimes(1);
    expect(validatePasswordMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.password,
      EXAMPLE_ACCOUNT.password
    );
    expect(hashPasswordMock).toHaveBeenCalledTimes(1);
    expect(hashPasswordMock).toHaveBeenCalledWith(EXAMPLE_NEW_PASSWORD);
    expect(setPasswordMock).toHaveBeenCalledTimes(1);
    expect(setPasswordMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_NEW_HASHED_PASSWORD
    );
  });

  describe("signupWithBusinessEmail", () => {
    it("should track the event when a user signs up with a business email", async () => {
      const email = "invalid@invalid.com";

      const result = await service.signupWithBusinessEmail({
        data: {
          email,
        },
      });

      expect(result).toBeTruthy();

      expect(segmentAnalyticsIdentifyMock).toHaveBeenCalledTimes(1);
      expect(segmentAnalyticsTrackManualMock).toHaveBeenCalledTimes(1);
      expect(segmentAnalyticsTrackManualMock).toHaveBeenCalledWith({
        user: {},
        data: {
          event: EnumEventType.StartEmailSignup,
          properties: {
            identityProvider: IdentityProvider.IdentityPlatform,
            existingUser: "No",
          },
        },
      });
    });

    it("when an amplication user already exists, should create only an Auth0 user (not an amplication user) and reset password if the user does not exist on Auth0", async () => {
      const email = "invalid@invalid.com";

      findAccountMock.mockResolvedValueOnce(EXAMPLE_ACCOUNT);

      const result = await service.signupWithBusinessEmail({
        data: {
          email,
        },
      });

      expect(result).toBeTruthy();

      expect(auth0ServiceCreateUserMock).toHaveBeenCalledTimes(1);
      expect(auth0ServiceCreateUserMock).toHaveBeenCalledWith(email);
      expect(auth0ServiceResetUserPasswordMock).toHaveBeenCalledTimes(1);
    });

    it("when an amplication user already does not exists, should create only an Auth0 user (not an amplication user) and reset password if the user does not exist on Auth0", async () => {
      const email = "invalid@invalid.com";
      findAccountMock.mockResolvedValueOnce(null);

      const result = await service.signupWithBusinessEmail({
        data: {
          email,
        },
      });

      expect(result).toBeTruthy();

      expect(auth0ServiceCreateUserMock).toHaveBeenCalledTimes(1);
      expect(auth0ServiceCreateUserMock).toHaveBeenCalledWith(email);
      expect(auth0ServiceResetUserPasswordMock).toHaveBeenCalledTimes(1);
    });

    it("should not create an Auth0 user, but only reset password if the user already exists on Auth0", async () => {
      const email = "invalid@invalid.com";

      auth0ServiceGetUserByEmailMock.mockResolvedValueOnce({
        email,
      });

      const result = await service.signupWithBusinessEmail({
        data: {
          email,
        },
      });

      expect(result).toBeTruthy();

      expect(auth0ServiceCreateUserMock).toHaveBeenCalledTimes(0);
      expect(auth0ServiceResetUserPasswordMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("trackCompleteEmailSignup", () => {
    it("should track the event only when a user completes the signup with a business email and login for the first time", async () => {
      service.trackCompleteEmailSignup(
        EXAMPLE_USER.account,
        {
          email: EXAMPLE_ACCOUNT.email,
          sub: "asdadsad",
          nickname: "asdasd",
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: EXAMPLE_ACCOUNT.firstName,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          family_name: EXAMPLE_ACCOUNT.lastName,
          identityOrigin: EXAMPLE_BUSINESS_EMAIL_IDP_CONNECTION_NAME,
          loginsCount: 1,
          name: EXAMPLE_ACCOUNT.firstName,
        },
        false
      );

      expect(segmentAnalyticsIdentifyMock).toHaveBeenCalledTimes(0);
      expect(segmentAnalyticsTrackManualMock).toHaveBeenCalledTimes(1);
      expect(segmentAnalyticsTrackManualMock).toHaveBeenCalledWith({
        user: {
          accountId: EXAMPLE_ACCOUNT.id,
        },
        data: {
          event: EnumEventType.CompleteEmailSignup,
          properties: {
            identityProvider: IdentityProvider.IdentityPlatform,
            identityOrigin: EXAMPLE_BUSINESS_EMAIL_IDP_CONNECTION_NAME,
            existingUser: false,
          },
        },
      });
    });

    it("should not track the event when a user with a business email logs in for the second time forward", async () => {
      service.trackCompleteEmailSignup(
        EXAMPLE_USER.account,
        {
          email: EXAMPLE_ACCOUNT.email,
          sub: "asdadsad",
          nickname: "asdasd",
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: EXAMPLE_ACCOUNT.firstName,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          family_name: EXAMPLE_ACCOUNT.lastName,
          identityOrigin: EXAMPLE_BUSINESS_EMAIL_IDP_CONNECTION_NAME,
          loginsCount: 2,
          name: EXAMPLE_ACCOUNT.firstName,
        },
        false
      );

      expect(segmentAnalyticsIdentifyMock).toHaveBeenCalledTimes(0);
      expect(segmentAnalyticsTrackManualMock).toHaveBeenCalledTimes(0);
      expect(segmentAnalyticsTrackWithContextMock).toHaveBeenCalledTimes(0);
    });

    it("should not track the event when a SSO user logs in", async () => {
      service.trackCompleteEmailSignup(
        EXAMPLE_USER.account,
        {
          email: EXAMPLE_ACCOUNT.email,
          sub: "asdadsad",
          nickname: "asdasd",
          // eslint-disable-next-line @typescript-eslint/naming-convention
          given_name: EXAMPLE_ACCOUNT.firstName,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          family_name: EXAMPLE_ACCOUNT.lastName,
          identityOrigin: "AnSSOIntegration",
          loginsCount: 2,
          name: EXAMPLE_ACCOUNT.firstName,
        },
        false
      );

      expect(segmentAnalyticsIdentifyMock).toHaveBeenCalledTimes(0);
      expect(segmentAnalyticsTrackManualMock).toHaveBeenCalledTimes(0);
      expect(segmentAnalyticsTrackWithContextMock).toHaveBeenCalledTimes(0);
    });
  });

  describe("configureJtw", () => {
    it("should generate a jwt, setup a temporary cookie that client will use to store the jwt and return a redirect 301", async () => {
      await service.configureJtw(
        responseMock,
        {
          account: {
            id: "test",
            createdAt: undefined,
            updatedAt: undefined,
            email: "",
            firstName: "",
            lastName: "",
            password: "",
          },
          id: "",
          createdAt: undefined,
          updatedAt: undefined,
          workspace: new Workspace(),
          isOwner: false,
          permissions: ["privatePlugin.create"],
        },
        false
      );

      expect(responseMock.cookie).toHaveBeenCalledWith(
        "AJWT",
        expect.any(String),
        {
          domain: expectedDomain,
          secure: true,
        }
      );

      expect(responseMock.redirect).toHaveBeenCalledWith(
        301,
        urlQueryParamExample
      );
    });
  });

  describe("when a user logs in through an OpenIdConnect IdP", () => {
    describe("and an amplication user with the same email already exist", () => {
      beforeEach(() => {
        findUsersMock.mockResolvedValue([EXAMPLE_AUTH_USER]);
      });
      it("should update the user and track the event", async () => {
        const authProfile: AuthProfile = {
          sub: "123",
          email: "local@invalid.com",
          nickname: "",
          identityOrigin: "AnSSOIntegration",
          loginsCount: 1,
        };
        updateAccountMock.mockResolvedValueOnce(EXAMPLE_ACCOUNT);

        await service.loginOrSignUp(authProfile, responseMock);

        expect(responseMock.cookie).toHaveBeenCalledWith(
          "AJWT",
          expect.any(String),
          {
            domain: expectedDomain,
            secure: true,
          }
        );
        expect(createAccountMock).toHaveBeenCalledTimes(0);
        expect(updateAccountMock).toHaveBeenCalledTimes(1);

        expect(responseMock.redirect).toHaveBeenCalledWith(
          301,
          urlQueryParamExample
        );
      });
    });
    describe("and an amplication user with the same email does not exist", () => {
      beforeEach(() => {
        findUsersMock.mockResolvedValue([]);
        getAuthUserMock.mockResolvedValue(null);
      });

      it("should create a new amplication user and track the event", async () => {
        const authProfile: AuthProfile = {
          sub: "123",
          email: "local@invalid.com",
          nickname: "",
          identityOrigin: "AnSSOIntegration",
          loginsCount: 1,
        };

        createAccountMock.mockResolvedValueOnce(EXAMPLE_ACCOUNT);
        updateAccountMock.mockResolvedValueOnce(EXAMPLE_ACCOUNT);

        await service.loginOrSignUp(authProfile, responseMock);

        expect(responseMock.cookie).toHaveBeenCalledWith(
          "AJWT",
          expect.any(String),
          {
            domain: expectedDomain,
            secure: true,
          }
        );

        expect(createAccountMock).toHaveBeenCalledTimes(1);
        expect(updateAccountMock).toHaveBeenCalledTimes(1);
        expect(responseMock.redirect).toHaveBeenCalledWith(
          301,
          urlQueryParamExample
        );
      });
    });
  });
});
