import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { WorkspaceService } from "./workspace.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PasswordService } from "../account/password.service";
import { UserService } from "../user/user.service";
import { AccountService } from "../account/account.service";
import { MailService } from "../mail/mail.service";
import { Workspace, Account, User, Project } from "../../models";
import { DeleteUserArgs } from "./dto";
import { SubscriptionService } from "../subscription/subscription.service";
import { ProjectService } from "../project/project.service";
import { BillingService } from "../billing/billing.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { Env } from "../../env";
import { BooleanEntitlement, MeteredEntitlement } from "@stigg/node-server-sdk";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { BillingFeature } from "@amplication/util-billing-types";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";

const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_WORKSPACE_NAME = "exampleWorkspaceName";

const EXAMPLE_ACCOUNT_ID = "exampleAccountId";
const EXAMPLE_EMAIL = "exampleEmail";
const EXAMPLE_FIRST_NAME = "exampleFirstName";
const EXAMPLE_LAST_NAME = "exampleLastName";
const EXAMPLE_PASSWORD = "examplePassword";

const EXAMPLE_NONEXISTING_EMAIL = "exampleNonexistingEmail";

const EXAMPLE_USER_ID = "exampleUserId";

const EXAMPLE_NEW_PASSWORD = "exampleNewPassword";

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ACCOUNT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD,
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  account: EXAMPLE_ACCOUNT,
  isOwner: true,
};

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_WORKSPACE_NAME,
  users: [EXAMPLE_USER],
  allowLLMFeatures: true,
};

const EXAMPLE_PROJECT: Project = {
  id: "exampleId",
  name: "Example name",
  workspaceId: "ExampleWorkspaceId",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
  useDemoRepo: false,
  demoRepoName: undefined,
  licensed: true,
};

EXAMPLE_USER.workspace = EXAMPLE_WORKSPACE;

const prismaWorkspaceFindOneMock = jest.fn(() => {
  return EXAMPLE_WORKSPACE;
});
const prismaWorkspaceFindManyMock = jest.fn(() => {
  return [EXAMPLE_WORKSPACE];
});
const prismaWorkspaceDeleteMock = jest.fn(() => {
  return EXAMPLE_WORKSPACE;
});
const prismaWorkspaceUpdateMock = jest.fn(() => {
  return EXAMPLE_WORKSPACE;
});
const prismaWorkspaceCreateMock = jest.fn(() => {
  return EXAMPLE_WORKSPACE;
});
const prismaUserFindManyMock = jest.fn(() => {
  return [EXAMPLE_USER];
});
const prismaUserCreateMock = jest.fn(() => {
  return EXAMPLE_USER;
});
const userServiceFindUserMock = jest.fn(() => {
  return EXAMPLE_USER;
});
const userServiceDeleteMock = jest.fn(() => {
  return EXAMPLE_USER;
});
const accountServiceFindAccountMock = jest.fn(() => {
  return EXAMPLE_ACCOUNT;
});
const accountServiceCreateAccountMock = jest.fn(() => {
  return EXAMPLE_ACCOUNT;
});
const passwordServiceGeneratePasswordMock = jest.fn(() => {
  return EXAMPLE_NEW_PASSWORD;
});
const passwordServiceHashPasswordMock = jest.fn(() => {
  return EXAMPLE_NEW_PASSWORD;
});
const createProjectMock = jest.fn(() => {
  return EXAMPLE_PROJECT;
});

const billingServiceIsBillingEnabledMock = jest.fn();

const billingServiceMock = {
  getMeteredEntitlement: jest.fn(() => {
    return {
      usageLimit: undefined,
    } as unknown as MeteredEntitlement;
  }),
  getNumericEntitlement: jest.fn(() => {
    return {};
  }),
  getBooleanEntitlement: jest.fn(() => {
    return {};
  }),
  reportUsage: jest.fn(() => {
    return {};
  }),
  provisionCustomer: jest.fn(() => {
    return {};
  }),
};
// This is important to mock the getter!!!
Object.defineProperty(billingServiceMock, "isBillingEnabled", {
  get: billingServiceIsBillingEnabledMock,
});

const mockUpdateProjectLicensed = jest.fn();
const mockUpdateServiceLicensed = jest.fn();

const createDemoRepoMock = jest.fn();

describe("WorkspaceService", () => {
  let service: WorkspaceService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkspaceService,
        {
          provide: UserService,
          useClass: jest.fn().mockImplementation(() => ({
            findUser: userServiceFindUserMock,
            delete: userServiceDeleteMock,
          })),
        },
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case Env.USER_LAST_ACTIVE_DAYS:
                  return "30";
                default:
                  return "";
              }
            },
          },
        },
        {
          provide: AmplicationLogger,
          useClass: jest.fn().mockImplementation(() => ({
            error: jest.fn(() => {
              return {};
            }),
            info: jest.fn(() => {
              return {};
            }),
          })),
        },
        {
          provide: BillingService,
          useValue: billingServiceMock,
        },
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            workspace: {
              findUnique: prismaWorkspaceFindOneMock,
              findMany: prismaWorkspaceFindManyMock,
              delete: prismaWorkspaceDeleteMock,
              update: prismaWorkspaceUpdateMock,
              create: prismaWorkspaceCreateMock,
            },
            user: {
              findMany: prismaUserFindManyMock,
              create: prismaUserCreateMock,
            },
          })),
        },
        {
          provide: MailService,
          useClass: jest.fn().mockImplementation(() => ({})),
        },
        {
          provide: AccountService,
          useClass: jest.fn().mockImplementation(() => ({
            findAccount: accountServiceFindAccountMock,
            createAccount: accountServiceCreateAccountMock,
          })),
        },
        {
          provide: PasswordService,
          useClass: jest.fn().mockImplementation(() => ({
            generatePassword: passwordServiceGeneratePasswordMock,
            hashPassword: passwordServiceHashPasswordMock,
          })),
        },
        {
          provide: SubscriptionService,
          useClass: jest.fn().mockImplementation(() => ({
            updateProjectLicensed: mockUpdateProjectLicensed,
            updateServiceLicensed: mockUpdateServiceLicensed,
          })),
        },
        {
          provide: ProjectService,
          useClass: jest.fn().mockImplementation(() => ({
            createProject: createProjectMock,
            createDemoRepo: createDemoRepoMock,
          })),
        },
        MockedSegmentAnalyticsProvider(),
      ],
    }).compile();

    service = module.get<WorkspaceService>(WorkspaceService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should find one workspace", async () => {
    const args = { where: { id: EXAMPLE_WORKSPACE_ID } };
    expect(await service.getWorkspace(args)).toEqual(EXAMPLE_WORKSPACE);
    expect(prismaWorkspaceFindOneMock).toBeCalledTimes(1);
    expect(prismaWorkspaceFindOneMock).toBeCalledWith(args);
  });

  it("should find many workspaces", async () => {
    const args = { where: { id: EXAMPLE_WORKSPACE_ID } };
    expect(await service.getWorkspaces(args)).toEqual([EXAMPLE_WORKSPACE]);
    expect(prismaWorkspaceFindManyMock).toBeCalledTimes(1);
    expect(prismaWorkspaceFindManyMock).toBeCalledWith(args);
  });

  it("should delete an workspace", async () => {
    const args = { where: { id: EXAMPLE_WORKSPACE_ID } };
    expect(await service.deleteWorkspace(args)).toEqual(EXAMPLE_WORKSPACE);
    expect(prismaWorkspaceDeleteMock).toBeCalledTimes(1);
    expect(prismaWorkspaceDeleteMock).toBeCalledWith(args);
  });

  it("should update an workspace", async () => {
    const args = {
      data: {},
      where: { id: EXAMPLE_WORKSPACE_ID },
    };
    expect(await service.updateWorkspace(args)).toEqual(EXAMPLE_WORKSPACE);
    expect(prismaWorkspaceUpdateMock).toBeCalledTimes(1);
    expect(prismaWorkspaceUpdateMock).toBeCalledWith(args);
  });

  it("should not delete a workspace owner", async () => {
    const args: DeleteUserArgs = {
      where: { id: EXAMPLE_USER_ID },
    };
    await expect(service.deleteUser(EXAMPLE_USER, args)).rejects.toThrow(
      `Can't delete the workspace owner`
    );
  });

  describe("when billing is enabled", () => {
    beforeEach(() => {
      billingServiceIsBillingEnabledMock.mockReturnValue(true);
    });
    it("should create a workspace if allow workspace creation is true", async () => {
      billingServiceMock.getBooleanEntitlement.mockReturnValueOnce({
        hasAccess: true,
      } as unknown as BooleanEntitlement);

      const args = {
        accountId: EXAMPLE_ACCOUNT_ID,
        args: {
          data: {
            name: EXAMPLE_WORKSPACE_NAME,
          },
        },
      };
      const prismaArgs = {
        ...args.args,
        data: {
          ...args.args.data,
          users: {
            create: {
              account: { connect: { id: args.accountId } },
              isOwner: true,
            },
          },
        },
        include: {
          users: true,
        },
      };
      expect(await service.createWorkspace(args.accountId, args.args)).toEqual(
        EXAMPLE_WORKSPACE
      );
      expect(prismaWorkspaceCreateMock).toBeCalledTimes(1);
      expect(prismaWorkspaceCreateMock).toBeCalledWith(prismaArgs);
      expect(createDemoRepoMock).toBeCalledTimes(0);
    });

    it("should throw a billing limitation error if the allow workspace creation entitlement is false", async () => {
      billingServiceMock.getBooleanEntitlement.mockReturnValueOnce({
        hasAccess: false,
      } as unknown as BooleanEntitlement);

      const args = {
        accountId: EXAMPLE_ACCOUNT_ID,
        args: {
          data: {
            name: EXAMPLE_WORKSPACE_NAME,
          },
        },
      };

      await expect(
        service.createWorkspace(args.accountId, args.args)
      ).rejects.toThrow(
        new BillingLimitationError(
          "Your current plan does not allow creating workspaces",
          BillingFeature.AllowWorkspaceCreation
        )
      );

      expect(prismaWorkspaceCreateMock).toBeCalledTimes(0);
    });

    it("should create a workspace even if allow workspace creation is false when it's the first workspace for a new user", async () => {
      billingServiceMock.getBooleanEntitlement.mockReturnValueOnce({
        hasAccess: false,
      } as unknown as BooleanEntitlement);

      const args = {
        accountId: EXAMPLE_ACCOUNT_ID,
        args: {
          data: {
            name: EXAMPLE_WORKSPACE_NAME,
          },
        },
      };
      const prismaArgs = {
        ...args.args,
        data: {
          ...args.args.data,
          users: {
            create: {
              account: { connect: { id: args.accountId } },
              isOwner: true,
            },
          },
        },
        include: {
          users: true,
        },
      };
      expect(
        await service.createWorkspace(args.accountId, args.args, true)
      ).toEqual(EXAMPLE_WORKSPACE);
      expect(prismaWorkspaceCreateMock).toBeCalledTimes(1);
      expect(prismaWorkspaceCreateMock).toBeCalledWith(prismaArgs);
      expect(createDemoRepoMock).toBeCalledTimes(0);
    });

    it("should create a demo repo when creating a workspace ", async () => {
      billingServiceMock.getBooleanEntitlement.mockReset();
      billingServiceMock.getBooleanEntitlement.mockReturnValueOnce({
        hasAccess: true,
      } as unknown as BooleanEntitlement);

      const args = {
        accountId: EXAMPLE_ACCOUNT_ID,
        args: {
          data: {
            name: EXAMPLE_WORKSPACE_NAME,
          },
        },
      };
      const prismaArgs = {
        ...args.args,
        data: {
          ...args.args.data,
          users: {
            create: {
              account: { connect: { id: args.accountId } },
              isOwner: true,
            },
          },
        },
        include: {
          users: true,
        },
      };
      expect(
        await service.createWorkspace(
          args.accountId,
          args.args,
          false,
          undefined,
          true
        )
      ).toEqual(EXAMPLE_WORKSPACE);
      expect(prismaWorkspaceCreateMock).toBeCalledTimes(1);
      expect(prismaWorkspaceCreateMock).toBeCalledWith(prismaArgs);
      expect(createDemoRepoMock).toBeCalledTimes(1);
    });
  });

  describe("when billing is disabled", () => {
    beforeEach(() => {
      billingServiceIsBillingEnabledMock.mockReturnValue(false);
    });
    it("should create a workspace even if the allow workspace creation entitlement is false", async () => {
      billingServiceMock.getBooleanEntitlement.mockReturnValueOnce({
        hasAccess: false,
      } as unknown as BooleanEntitlement);

      const args = {
        accountId: EXAMPLE_ACCOUNT_ID,
        args: {
          data: {
            name: EXAMPLE_WORKSPACE_NAME,
          },
        },
      };
      const prismaArgs = {
        ...args.args,
        data: {
          ...args.args.data,
          users: {
            create: {
              account: { connect: { id: args.accountId } },
              isOwner: true,
            },
          },
        },
        include: {
          users: true,
        },
      };
      expect(await service.createWorkspace(args.accountId, args.args)).toEqual(
        EXAMPLE_WORKSPACE
      );
      expect(prismaWorkspaceCreateMock).toBeCalledTimes(1);
      expect(prismaWorkspaceCreateMock).toBeCalledWith(prismaArgs);
    });
  });

  /**@todo fix test*/
  it.skip("should throw conflict exception if invited user is already in the workspace", async () => {
    const functionArgs = {
      currentUser: EXAMPLE_USER,
      args: { data: { email: EXAMPLE_EMAIL } },
    };
    const accountArgs = {
      where: { email: EXAMPLE_EMAIL },
    };

    await expect(
      service.inviteUser(functionArgs.currentUser, functionArgs.args)
    ).rejects.toThrow(
      `User with email ${functionArgs.args.data.email} already exist in the workspace.`
    );
    expect(accountServiceFindAccountMock).toBeCalledTimes(1);
    expect(accountServiceFindAccountMock).toBeCalledWith(accountArgs);
    /**@todo test prisma user calls */
    // expect(prismaUserFindManyMock).toBeCalledTimes(1);
    // expect(prismaUserFindManyMock).toBeCalledWith(existingUsersArgs);
  });
  /**@todo fix test */
  it.skip("should create an account and invite user to workspace", async () => {
    accountServiceFindAccountMock.mockImplementation(() => null);

    const functionArgs = {
      currentUser: EXAMPLE_USER,
      args: { data: { email: EXAMPLE_NONEXISTING_EMAIL } },
    };
    const accountArgs = {
      where: { email: EXAMPLE_NONEXISTING_EMAIL },
    };
    const userCreateArgs = {
      data: {
        workspace: { connect: { id: EXAMPLE_WORKSPACE_ID } },
        account: { connect: { id: EXAMPLE_ACCOUNT_ID } },
      },
    };
    const createAccountArgs = {
      data: {
        firstName: "",
        lastName: "",
        email: functionArgs.args.data.email,
        password: EXAMPLE_NEW_PASSWORD,
      },
    };
    expect(
      await service.inviteUser(functionArgs.currentUser, functionArgs.args)
    ).toEqual(EXAMPLE_USER);
    expect(accountServiceFindAccountMock).toBeCalledTimes(1);
    expect(accountServiceFindAccountMock).toBeCalledWith(accountArgs);
    expect(passwordServiceGeneratePasswordMock).toBeCalledTimes(1);
    expect(passwordServiceGeneratePasswordMock).toBeCalledWith();
    expect(passwordServiceHashPasswordMock).toBeCalledTimes(1);
    expect(passwordServiceHashPasswordMock).toBeCalledWith(
      EXAMPLE_NEW_PASSWORD
    );
    expect(accountServiceCreateAccountMock).toBeCalledTimes(1);
    expect(accountServiceCreateAccountMock).toBeCalledWith(createAccountArgs);
    expect(prismaUserCreateMock).toBeCalledTimes(1);
    expect(prismaUserCreateMock).toBeCalledWith(userCreateArgs);
  });

  describe("bulkUpdateWorkspaceProjectsAndResourcesLicensed", () => {
    it("should update workspaces correctly when useUserLastActive is true", async () => {
      const date = new Date();
      const result =
        await service.bulkUpdateWorkspaceProjectsAndResourcesLicensed(true);

      expect(result).toBe(true);
      expect(prismaWorkspaceFindManyMock).toHaveBeenCalledWith({
        where: {
          users: {
            some: {
              lastActive: {
                gte: new Date(date.setDate(date.getDate() - 30)),
              },
            },
          },
          projects: {
            some: {
              deletedAt: null,
              resources: {
                some: {
                  deletedAt: null,
                  archived: { not: true },
                  resourceType: {
                    in: [EnumResourceType.Service],
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
        },
      });
      expect(mockUpdateProjectLicensed).toHaveBeenCalledTimes(1);
      expect(mockUpdateServiceLicensed).toHaveBeenCalledTimes(1);
    });

    it("should update workspaces correctly when useUserLastActive is false", async () => {
      const result =
        await service.bulkUpdateWorkspaceProjectsAndResourcesLicensed(false);

      expect(result).toBe(true);
      expect(prismaWorkspaceFindManyMock).toHaveBeenCalledWith({
        where: {
          users: {},
          projects: {
            some: {
              deletedAt: null,
              resources: {
                some: {
                  deletedAt: null,
                  archived: { not: true },
                  resourceType: {
                    in: [EnumResourceType.Service],
                  },
                },
              },
            },
          },
        },
        select: {
          id: true,
        },
      });
      expect(mockUpdateProjectLicensed).toHaveBeenCalledTimes(1);
      expect(mockUpdateServiceLicensed).toHaveBeenCalledTimes(1);
    });
  });
});
