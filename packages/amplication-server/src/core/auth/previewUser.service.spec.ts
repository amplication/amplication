import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { Response } from "express";
import { anyString } from "jest-mock-extended";
import { Role } from "../../enums/EnumRole";
import { Account, Project, Resource, User, Workspace } from "../../models";
import { PrismaService, UserRole } from "../../prisma";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";
import { AccountService } from "../account/account.service";
import { Auth0Service } from "../idp/auth0.service";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { WorkspaceService } from "../workspace/workspace.service";
import { EnumTokenType } from "./dto";
import { EnumPreviewAccountType } from "./dto/EnumPreviewAccountType";
import { PreviewUserService } from "./previewUser.service";
import { AuthUser } from "./types";
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
  allowLLMFeatures: true,
};

const EXAMPLE_USER_ROLE: UserRole = {
  id: "admin",
  role: Role.Admin,
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: EXAMPLE_USER.id,
};

const EXAMPLE_AUTH_USER: AuthUser = {
  ...EXAMPLE_USER,
  userRoles: [EXAMPLE_USER_ROLE],
  workspace: EXAMPLE_WORKSPACE,
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

const signMock = jest.fn(() => EXAMPLE_TOKEN);

const createAccountMock = jest.fn();

const setCurrentUserMock = jest.fn(() => EXAMPLE_ACCOUNT_WITH_CURRENT_USER);

const prismaAccountFindOneMock = jest.fn(() => {
  return EXAMPLE_ACCOUNT_WITH_CURRENT_USER_WITH_ROLES_AND_WORKSPACE;
});

const setPasswordMock = jest.fn();
const findAccountMock = jest.fn();
const updateAccountMock = jest.fn();

const convertPreviewSubscriptionToFreeWithTrialMock = jest.fn();

const createPreviewEnvironmentMock = jest.fn(() => ({
  workspace: {
    ...EXAMPLE_WORKSPACE,
    users: [EXAMPLE_AUTH_USER],
  },
  project: EXAMPLE_PROJECT,
  resource: EXAMPLE_RESOURCE,
}));

const auth0ServiceCreateUserMock = jest.fn();
const auth0ServiceResetUserPasswordMock = jest.fn();
const auth0ServiceGetUserByEmailMock = jest.fn();

const prismaCreateProjectMock = jest.fn(() => EXAMPLE_PROJECT);
const segmentAnalyticsIdentifyMock = jest.fn().mockResolvedValue(undefined);
const segmentAnalyticsTrackWithContextMock = jest
  .fn()
  .mockResolvedValue(undefined);
const segmentAnalyticsTrackManualMock = jest.fn().mockResolvedValue(undefined);

describe("PreviewUserService", () => {
  let service: PreviewUserService;
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
        PreviewUserService,
      ],
      imports: [],
    }).compile();

    service = module.get<PreviewUserService>(PreviewUserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
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
        auth0ServiceGetUserByEmailMock.mockResolvedValueOnce(false);

        auth0ServiceCreateUserMock.mockResolvedValueOnce({
          data: {
            email: EXAMPLE_ACCOUNT.email,
          },
        });

        auth0ServiceResetUserPasswordMock.mockResolvedValueOnce({
          data: resetPasswordDataMocked,
        });

        findAccountMock.mockResolvedValueOnce(examplePreviewAccount);

        const result = await service.completeSignupPreviewAccount(exampleUser);

        expect(result).toEqual(resetPasswordDataMocked);
        expect(auth0ServiceGetUserByEmailMock).toHaveBeenCalledTimes(1);
        expect(auth0ServiceGetUserByEmailMock).toHaveBeenCalledWith(
          exampleUser.account.previewAccountEmail
        );
        expect(auth0ServiceCreateUserMock).toHaveBeenCalledTimes(1);
        expect(auth0ServiceCreateUserMock).toHaveBeenCalledWith(
          examplePreviewAccount.previewAccountEmail
        );
        expect(auth0ServiceResetUserPasswordMock).toHaveBeenCalledTimes(1);
        expect(auth0ServiceResetUserPasswordMock).toHaveBeenCalledWith(
          examplePreviewAccount.previewAccountEmail
        );
      });

      it("should not create an Auth0 user, but only reset password if the user already exists on Auth0", async () => {
        auth0ServiceGetUserByEmailMock.mockResolvedValueOnce(true);

        auth0ServiceCreateUserMock.mockResolvedValueOnce({
          data: {
            email: EXAMPLE_ACCOUNT.email,
          },
        });

        auth0ServiceResetUserPasswordMock.mockResolvedValueOnce({
          data: resetPasswordDataMocked,
        });

        findAccountMock.mockResolvedValueOnce(examplePreviewAccount);

        const result = await service.completeSignupPreviewAccount(exampleUser);

        expect(result).toEqual(resetPasswordDataMocked);

        expect(auth0ServiceGetUserByEmailMock).toHaveBeenCalledTimes(1);
        expect(auth0ServiceGetUserByEmailMock).toHaveBeenCalledWith(
          exampleUser.account.previewAccountEmail
        );
        expect(auth0ServiceCreateUserMock).toHaveBeenCalledTimes(0);

        expect(auth0ServiceResetUserPasswordMock).toHaveBeenCalledTimes(1);
        expect(auth0ServiceResetUserPasswordMock).toHaveBeenCalledWith(
          examplePreviewAccount.previewAccountEmail
        );
      });

      it("should update the preview account to a regular account with free trial if there is no account with the preview email", async () => {
        auth0ServiceGetUserByEmailMock.mockResolvedValueOnce(false);

        auth0ServiceCreateUserMock.mockResolvedValueOnce({
          data: {
            email: EXAMPLE_ACCOUNT.email,
          },
        });

        auth0ServiceResetUserPasswordMock.mockResolvedValueOnce({
          data: resetPasswordDataMocked,
        });

        findAccountMock.mockResolvedValueOnce(undefined);

        const result = await service.completeSignupPreviewAccount(exampleUser);

        expect(result).toEqual(resetPasswordDataMocked);
        expect(updateAccountMock).toHaveBeenCalledTimes(1);
      });

      it("should not update the preview account to a regular account with free trial if there is account with the preview email", async () => {
        auth0ServiceGetUserByEmailMock.mockResolvedValueOnce(false);

        auth0ServiceCreateUserMock.mockResolvedValueOnce({
          data: {
            email: EXAMPLE_ACCOUNT.email,
          },
        });

        auth0ServiceResetUserPasswordMock.mockResolvedValueOnce({
          data: resetPasswordDataMocked,
        });

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
});
