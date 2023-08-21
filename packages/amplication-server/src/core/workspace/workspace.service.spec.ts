import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { WorkspaceService } from "./workspace.service";
import { PrismaService } from "../../prisma/prisma.service";
import { PasswordService } from "../account/password.service";
import { UserService } from "../user/user.service";
import { AccountService } from "../account/account.service";
import { ResourceService } from "../resource/resource.service";
import { MailService } from "../mail/mail.service";
import { Workspace, Account, User, Project } from "../../models";
import { Role } from "../../enums/Role";
import { DeleteUserArgs } from "./dto";
import { SubscriptionService } from "../subscription/subscription.service";
import { ProjectService } from "../project/project.service";
import { BillingService } from "../billing/billing.service";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";

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

const resourceCreateSampleResourceMock = jest.fn();

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
        ConfigService,
        {
          provide: BillingService,
          useValue: {
            getMeteredEntitlement: jest.fn(() => {
              return {};
            }),
            getNumericEntitlement: jest.fn(() => {
              return {};
            }),
            provisionCustomer: jest.fn(() => {
              return {};
            }),
          },
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
          provide: ResourceService,
          useClass: jest.fn().mockImplementation(() => ({
            createSampleResource: resourceCreateSampleResourceMock,
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
          useClass: jest.fn().mockImplementation(() => ({})),
        },
        {
          provide: ProjectService,
          useClass: jest.fn().mockImplementation(() => ({
            createProject: createProjectMock,
          })),
        },
        {
          provide: SegmentAnalyticsService,
          useClass: jest.fn(() => ({
            track: jest.fn(() => {
              return;
            }),
          })),
        },
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

  it("should create an workspace", async () => {
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
            userRoles: {
              create: {
                role: Role.OrganizationAdmin,
              },
            },
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
});
