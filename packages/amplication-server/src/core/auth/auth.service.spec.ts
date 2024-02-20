import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService, UserRole } from "../../prisma";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../../enums/Role";
import { AccountService } from "../account/account.service";
import { PasswordService } from "../account/password.service";
import { UserService } from "../user/user.service";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { AuthService } from "./auth.service";
import { WorkspaceService } from "../workspace/workspace.service";
import { EnumTokenType } from "./dto";
import { ConfigService } from "@nestjs/config";
import { EnumPreviewAccountType } from "./dto/EnumPreviewAccountType";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { Workspace, Project, Resource, Account, User } from "../../models";
import { JSONApiResponse, SignUpResponse, TextApiResponse } from "auth0";
import { anyString } from "jest-mock-extended";
import { AuthProfile, AuthUser } from "./types";
import { IdentityProvider } from "./auth.types";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { Response } from "express";
import { Env } from "../../env";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";
const EXAMPLE_TOKEN = "EXAMPLE TOKEN";
const WORK_EMAIL_INVALID = `Email must be a work email address`;

const EXAMPLE_ACCOUNT: Account = {
  id: "alice",
  email: "example@amplication.com",
  password: "PASSWORD",
  firstName: "Alice",
  lastName: "Appleseed",
  createdAt: new Date(),
  updatedAt: new Date(),
  githubId: null,
  previewAccountType: EnumPreviewAccountType.None,
  previewAccountEmail: null,
};

const EXAMPLE_PREVIEW_ACCOUNT: Account = {
  id: "alice",
  email: "fake+example@amplication.com",
  password: "PASSWORD",
  firstName: "Alice",
  lastName: "Appleseed",
  createdAt: new Date(),
  updatedAt: new Date(),
  githubId: null,
  previewAccountType: EnumPreviewAccountType.BreakingTheMonolith,
  previewAccountEmail: "examplePreveiw@amplication.com",
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
const NOW = new Date();
const EXAMPLE_RESOURCE: Resource = {
  id: "exampleResourceId",
  resourceType: EnumResourceType.Service,
  name: "Example Resource",
  description: null,
  licensed: true,
  createdAt: NOW,
  updatedAt: NOW,
  gitRepositoryOverride: false,
};

const EXAMPLE_HASHED_PASSWORD = "HASHED PASSWORD";
const EXAMPLE_NEW_PASSWORD = "NEW PASSWORD";
const EXAMPLE_NEW_HASHED_PASSWORD = "NEW HASHED PASSWORD";

const EXAMPLE_WORKSPACE_ID = "EXAMPLE_WORKSPACE_ID";

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
};

const EXAMPLE_OTHER_WORKSPACE: Workspace = {
  id: "exampleOtherWorkspace",
  name: "Example Other Workspace",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const EXAMPLE_USER_ROLE: UserRole = {
  id: "admin",
  role: Role.Admin,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: EXAMPLE_USER.id,
};

const EXAMPLE_OTHER_USER: User = {
  id: "exampleOtherUser",
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true,
  lastActive: null,
};

const EXAMPLE_OTHER_USER_ROLE: UserRole = {
  id: "otherAdmin",
  role: Role.Admin,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: EXAMPLE_OTHER_USER.id,
};

const EXAMPLE_AUTH_USER: AuthUser = {
  ...EXAMPLE_USER,
  userRoles: [EXAMPLE_USER_ROLE],
  workspace: EXAMPLE_WORKSPACE,
  account: EXAMPLE_ACCOUNT,
};

const EXAMPLE_OTHER_AUTH_USER: AuthUser = {
  ...EXAMPLE_OTHER_USER,
  userRoles: [EXAMPLE_OTHER_USER_ROLE],
  workspace: EXAMPLE_OTHER_WORKSPACE,
  account: EXAMPLE_ACCOUNT,
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

jest.mock("auth0", () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ManagementClient: jest.fn().mockImplementation(() => {
      return {
        usersByEmail: {
          getByEmail: mockManagementClientGetByEmail,
        },
      };
    }),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    AuthenticationClient: jest.fn().mockImplementation(() => {
      return {
        database: {
          changePassword: mockAuthenticationClientDatabaseChangePassword,
          signUp: mockAuthenticationClientDatabaseSignUp,
        },
      };
    }),
  };
});

const mockManagementClientGetByEmail = jest.fn();
const mockAuthenticationClientDatabaseChangePassword = jest.fn();
const mockAuthenticationClientDatabaseSignUp = jest.fn();

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

const findUsersMock = jest.fn().mockResolvedValue([EXAMPLE_OTHER_AUTH_USER]);

const createWorkspaceMock = jest.fn(() => ({
  ...EXAMPLE_WORKSPACE,
  users: [EXAMPLE_AUTH_USER],
}));

const convertPreviewSubscriptionToFreeWithTrialMock = jest.fn();

const createPreviewEnvironmentMock = jest.fn(() => ({
  workspace: {
    ...EXAMPLE_WORKSPACE,
    users: [EXAMPLE_AUTH_USER],
  },
  project: EXAMPLE_PROJECT,
  resource: EXAMPLE_RESOURCE,
}));

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
          })),
        },
        {
          provide: WorkspaceService,
          useClass: jest.fn(() => ({
            createWorkspace: createWorkspaceMock,
            createPreviewWorkspace: createWorkspaceMock,
            convertPreviewSubscriptionToFreeWithTrial:
              convertPreviewSubscriptionToFreeWithTrialMock,
            createPreviewEnvironment: createPreviewEnvironmentMock,
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
    expect(createWorkspaceMock).toHaveBeenCalledWith(EXAMPLE_ACCOUNT.id, {
      data: {
        name: EXAMPLE_WORKSPACE.name,
      },
      include: {
        users: {
          include: {
            account: true,
            userRoles: true,
            workspace: true,
          },
        },
      },
    });
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      workspaceId: EXAMPLE_WORKSPACE.id,
      roles: [EXAMPLE_USER_ROLE.role],
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
          include: { account: true, workspace: true, userRoles: true },
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
      roles: [EXAMPLE_USER_ROLE.role],
      userId: EXAMPLE_USER.id,
      type: EnumTokenType.User,
    });
  });

  it("sets current workspace for existing user and existing workspace", async () => {
    const result = await service.setCurrentWorkspace(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_OTHER_WORKSPACE.id
    );
    expect(result).toBe(EXAMPLE_TOKEN);
    expect(findUsersMock).toHaveBeenCalledTimes(1);
    expect(findUsersMock).toHaveBeenCalledWith({
      where: {
        workspace: {
          id: EXAMPLE_OTHER_WORKSPACE.id,
        },
        account: {
          id: EXAMPLE_ACCOUNT.id,
        },
      },
      include: {
        account: true,
        workspace: true,
        userRoles: true,
      },
      take: 1,
    });
    expect(setCurrentUserMock).toHaveBeenCalledTimes(1);
    expect(setCurrentUserMock).toHaveBeenCalledWith(
      EXAMPLE_ACCOUNT.id,
      EXAMPLE_OTHER_AUTH_USER.id
    );
    expect(signMock).toHaveBeenCalledTimes(1);
    expect(signMock).toHaveBeenCalledWith({
      accountId: EXAMPLE_ACCOUNT.id,
      workspaceId: EXAMPLE_OTHER_WORKSPACE.id,
      roles: [EXAMPLE_USER_ROLE.role],
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

  describe("preview account", () => {
    it("should fail to signup a preview account when the email is not work email", async () => {
      createAccountMock.mockResolvedValueOnce({
        ...EXAMPLE_PREVIEW_ACCOUNT,
        previewAccountEmail: "test@gmail.com",
      });

      await expect(
        service.signupPreviewAccount({
          previewAccountEmail: "test@gmail.com",
          previewAccountType:
            EnumPreviewAccountType[EXAMPLE_PREVIEW_ACCOUNT.previewAccountType],
        })
      ).rejects.toThrowError(WORK_EMAIL_INVALID);

      expect(createAccountMock).toHaveBeenCalledTimes(0);
      expect(createAccountMock).toHaveBeenCalledTimes(0);
      expect(signMock).toHaveBeenCalledTimes(0);
    });

    it("should signs up for correct data with preview account", async () => {
      createAccountMock.mockResolvedValueOnce(EXAMPLE_PREVIEW_ACCOUNT);

      const result = await service.signupPreviewAccount({
        previewAccountEmail: EXAMPLE_PREVIEW_ACCOUNT.previewAccountEmail,
        previewAccountType:
          EnumPreviewAccountType[EXAMPLE_PREVIEW_ACCOUNT.previewAccountType],
      });

      expect(result).toEqual({
        token: EXAMPLE_TOKEN,
        workspaceId: EXAMPLE_WORKSPACE.id,
        projectId: EXAMPLE_PROJECT.id,
        resourceId: EXAMPLE_RESOURCE.id,
      });

      expect(createAccountMock).toHaveBeenCalledTimes(1);
      expect(createAccountMock).toHaveBeenCalledTimes(1);
      expect(setCurrentUserMock).toHaveBeenCalledWith(
        EXAMPLE_ACCOUNT.id,
        EXAMPLE_USER.id
      );

      const jwtPayload = {
        accountId: EXAMPLE_ACCOUNT.id,
        workspaceId: EXAMPLE_WORKSPACE.id,
        roles: [EXAMPLE_USER_ROLE.role],
        userId: EXAMPLE_USER.id,
        type: EnumTokenType.User,
      };

      expect(signMock).toHaveBeenCalledTimes(1);
      expect(signMock).toHaveBeenCalledWith(jwtPayload);
    });

    describe("complete signup for preview account", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });
      const examplePreviewAccount = {
        ...EXAMPLE_PREVIEW_ACCOUNT,
        previewAccountEmail: EXAMPLE_PREVIEW_ACCOUNT.email,
      };

      const exampleUser = {
        ...EXAMPLE_USER,
        account: examplePreviewAccount,
        workspace: EXAMPLE_WORKSPACE,
      };

      // any string
      const resetPasswordDataMocked = anyString();
      it("should create an Auth0 user and reset password if the user does not exist on Auth0", async () => {
        const spyOnGetAuthUserByEmail = jest
          .spyOn(service, "getAuth0UserByEmail")
          .mockResolvedValueOnce(false);
        const spyOnCreateAuth0Account = jest
          .spyOn(service, "createAuth0User")
          .mockResolvedValueOnce({
            data: {
              email: EXAMPLE_ACCOUNT.email,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              email_verified: true,
              id: EXAMPLE_ACCOUNT.id,
            },
          } as unknown as JSONApiResponse<SignUpResponse>);
        const spyOnResetAuth0UserPassword = jest
          .spyOn(service, "resetAuth0UserPassword")
          .mockResolvedValueOnce({
            data: resetPasswordDataMocked,
          } as unknown as TextApiResponse);

        findAccountMock.mockResolvedValueOnce(examplePreviewAccount);

        const result = await service.completeSignupPreviewAccount(exampleUser);

        expect(result).toEqual(resetPasswordDataMocked);
        expect(spyOnGetAuthUserByEmail).toHaveBeenCalledTimes(1);
        expect(spyOnGetAuthUserByEmail).toHaveBeenCalledWith(
          exampleUser.account.previewAccountEmail
        );
        expect(spyOnCreateAuth0Account).toHaveBeenCalledTimes(1);
        expect(spyOnCreateAuth0Account).toHaveBeenCalledWith(
          examplePreviewAccount.previewAccountEmail
        );
        expect(spyOnResetAuth0UserPassword).toHaveBeenCalledTimes(1);
        expect(spyOnResetAuth0UserPassword).toHaveBeenCalledWith(
          examplePreviewAccount.previewAccountEmail
        );
      });

      it("should not create an Auth0 user, but only reset password if the user already exists on Auth0", async () => {
        const spyOnGetAuthUserByEmail = jest
          .spyOn(service, "getAuth0UserByEmail")
          .mockResolvedValueOnce(true);
        const spyOnCreateAuth0Account = jest
          .spyOn(service, "createAuth0User")
          .mockResolvedValueOnce({
            data: {
              email: EXAMPLE_ACCOUNT.email,
              // eslint-disable-next-line @typescript-eslint/naming-convention
              email_verified: true,
              id: EXAMPLE_ACCOUNT.id,
            },
          } as unknown as JSONApiResponse<SignUpResponse>);
        const spyOnResetAuth0UserPassword = jest
          .spyOn(service, "resetAuth0UserPassword")
          .mockResolvedValueOnce({
            data: "abc123",
          } as unknown as TextApiResponse);

        findAccountMock.mockResolvedValueOnce(examplePreviewAccount);

        const result = await service.completeSignupPreviewAccount(exampleUser);

        expect(result).toEqual(resetPasswordDataMocked);

        expect(spyOnGetAuthUserByEmail).toHaveBeenCalledTimes(1);
        expect(spyOnGetAuthUserByEmail).toHaveBeenCalledWith(
          exampleUser.account.previewAccountEmail
        );
        expect(spyOnCreateAuth0Account).toHaveBeenCalledTimes(0);

        expect(spyOnResetAuth0UserPassword).toHaveBeenCalledTimes(1);
        expect(spyOnResetAuth0UserPassword).toHaveBeenCalledWith(
          examplePreviewAccount.previewAccountEmail
        );
      });

      it("should update the preview account to a regular account with free trial if there is no account with the preview email", async () => {
        jest.spyOn(service, "getAuth0UserByEmail").mockResolvedValueOnce(false);
        jest.spyOn(service, "createAuth0User").mockResolvedValueOnce({
          data: {
            email: EXAMPLE_ACCOUNT.email,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            email_verified: true,
            id: EXAMPLE_ACCOUNT.id,
          },
        } as unknown as JSONApiResponse<SignUpResponse>);
        jest.spyOn(service, "resetAuth0UserPassword").mockResolvedValueOnce({
          data: "abc123",
        } as unknown as TextApiResponse);

        findAccountMock.mockResolvedValueOnce(undefined);

        const result = await service.completeSignupPreviewAccount(exampleUser);

        expect(result).toEqual(resetPasswordDataMocked);
        expect(updateAccountMock).toHaveBeenCalledTimes(1);
      });

      it("should not update the preview account to a regular account with free trial if there is account with the preview email", async () => {
        jest.spyOn(service, "getAuth0UserByEmail").mockResolvedValueOnce(false);
        jest.spyOn(service, "createAuth0User").mockResolvedValueOnce({
          data: {
            email: EXAMPLE_ACCOUNT.email,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            email_verified: true,
            id: EXAMPLE_ACCOUNT.id,
          },
        } as unknown as JSONApiResponse<SignUpResponse>);
        jest.spyOn(service, "resetAuth0UserPassword").mockResolvedValueOnce({
          data: "abc123",
        } as unknown as TextApiResponse);

        findAccountMock.mockResolvedValueOnce(examplePreviewAccount);

        const result = await service.completeSignupPreviewAccount(exampleUser);

        expect(result).toEqual(resetPasswordDataMocked);
        expect(updateAccountMock).toHaveBeenCalledTimes(0);
        expect(
          convertPreviewSubscriptionToFreeWithTrialMock
        ).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("signupWithBusinessEmail", () => {
    it("should track the event when a user signs up with a business email", async () => {
      const email = "invalid@invalid.com";

      mockManagementClientGetByEmail.mockResolvedValueOnce({
        data: [],
      });

      mockAuthenticationClientDatabaseSignUp.mockResolvedValueOnce({
        data: {
          email,
        },
      });

      mockAuthenticationClientDatabaseChangePassword.mockResolvedValueOnce({
        data: "ok",
      });

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

    it("should fail to signup a preview account when the email is not work email", async () => {
      const email = "invalid@gmail.com";

      await expect(
        service.signupWithBusinessEmail({
          data: {
            email,
          },
        })
      ).rejects.toThrow(WORK_EMAIL_INVALID);
    });

    it("when an amplication user already exists, should create only an Auth0 user (not an amplication user) and reset password if the user does not exist on Auth0", async () => {
      const email = "invalid@invalid.com";

      findAccountMock.mockResolvedValueOnce(EXAMPLE_ACCOUNT);

      mockManagementClientGetByEmail.mockResolvedValueOnce({
        data: [],
      });

      mockAuthenticationClientDatabaseSignUp.mockResolvedValueOnce({
        data: {
          email,
        },
      });

      mockAuthenticationClientDatabaseChangePassword.mockResolvedValueOnce({
        data: "ok",
      });

      const result = await service.signupWithBusinessEmail({
        data: {
          email,
        },
      });

      expect(result).toBeTruthy();

      expect(mockAuthenticationClientDatabaseSignUp).toHaveBeenCalledTimes(1);
      expect(mockAuthenticationClientDatabaseSignUp).toHaveBeenCalledWith({
        email,
        password: expect.any(String),
        connection: expect.any(String),
      });
      expect(
        mockAuthenticationClientDatabaseChangePassword
      ).toHaveBeenCalledTimes(1);
    });

    it("when an amplication user already does not exists, should create only an Auth0 user (not an amplication user) and reset password if the user does not exist on Auth0", async () => {
      const email = "invalid@invalid.com";
      findAccountMock.mockResolvedValueOnce(null);

      mockManagementClientGetByEmail.mockResolvedValueOnce({
        data: [],
      });

      mockAuthenticationClientDatabaseSignUp.mockResolvedValueOnce({
        data: {
          email,
        },
      });

      mockAuthenticationClientDatabaseChangePassword.mockResolvedValueOnce({
        data: "ok",
      });

      const result = await service.signupWithBusinessEmail({
        data: {
          email,
        },
      });

      expect(result).toBeTruthy();

      expect(mockAuthenticationClientDatabaseSignUp).toHaveBeenCalledTimes(1);
      expect(mockAuthenticationClientDatabaseSignUp).toHaveBeenCalledWith({
        email,
        password: expect.any(String),
        connection: expect.any(String),
      });
      expect(
        mockAuthenticationClientDatabaseChangePassword
      ).toHaveBeenCalledTimes(1);
    });

    it("should not create an Auth0 user, but only reset password if the user already exists on Auth0", async () => {
      const email = "invalid@invalid.com";

      mockManagementClientGetByEmail.mockResolvedValueOnce({
        data: [{ email }],
      });

      mockAuthenticationClientDatabaseSignUp.mockResolvedValueOnce({
        data: {
          email,
        },
      });

      mockAuthenticationClientDatabaseChangePassword.mockResolvedValueOnce({
        data: "ok",
      });

      const result = await service.signupWithBusinessEmail({
        data: {
          email,
        },
      });

      expect(result).toBeTruthy();

      expect(mockAuthenticationClientDatabaseSignUp).toHaveBeenCalledTimes(0);
      expect(
        mockAuthenticationClientDatabaseChangePassword
      ).toHaveBeenCalledTimes(1);
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
            previewAccountType: "None",
            previewAccountEmail: "",
          },
          id: "",
          createdAt: undefined,
          updatedAt: undefined,
          workspace: new Workspace(),
          userRoles: [],
          isOwner: false,
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
        "https://server.amplication.com?complete-signup=0"
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
          "https://server.amplication.com?complete-signup=0"
        );
      });

      it("should update preview user and track the event", async () => {
        const exampleUser = {
          ...EXAMPLE_USER,
          account: {
            ...EXAMPLE_USER.account,
            ...EXAMPLE_PREVIEW_ACCOUNT,
          },
          workspace: EXAMPLE_WORKSPACE,
        };

        jest.spyOn(service, "getAuthUser").mockResolvedValueOnce({
          ...EXAMPLE_AUTH_USER,
          account: {
            ...EXAMPLE_ACCOUNT,
            ...EXAMPLE_PREVIEW_ACCOUNT,
          },
        });

        const authProfile: AuthProfile = {
          sub: "123",
          email: exampleUser.account.previewAccountEmail,
          nickname: "",
          identityOrigin: "AnSSOIntegration",
          loginsCount: 1,
        };

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
        expect(updateAccountMock).toHaveBeenCalledWith({
          where: { id: exampleUser.account.id },
          data: {
            previewAccountEmail: null,
            previewAccountType: EnumPreviewAccountType.None,
          },
        });

        expect(
          convertPreviewSubscriptionToFreeWithTrialMock
        ).toHaveBeenCalledTimes(1);
        expect(
          convertPreviewSubscriptionToFreeWithTrialMock
        ).toHaveBeenCalledWith(exampleUser.workspace.id);

        expect(responseMock.redirect).toHaveBeenCalledWith(
          301,
          "https://server.amplication.com?complete-signup=0"
        );
      });
    });
    describe("and an amplication user with the same email does not exist", () => {
      beforeEach(() => {
        findUsersMock.mockResolvedValue([]);
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
          "https://server.amplication.com?complete-signup=0"
        );
      });
    });
  });
});
