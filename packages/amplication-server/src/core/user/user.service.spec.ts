import { Prisma, PrismaService } from "../../prisma";
import { Test, TestingModule } from "@nestjs/testing";
import { Role } from "../../enums/Role";
import { Account, User, UserRole } from "../../models";
import { UserService } from "./user.service";
import { BillingService } from "../billing/billing.service";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";

const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_ROLE_ID = "exampleRoleId";
const EXISTING_ROLE = Role.User;
const NON_EXISTING_ROLE = Role.Admin;
const EXAMPLE_USER_ROLE: UserRole = {
  id: EXAMPLE_ROLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  role: Role.User,
};

const EXAMPLE_FIRST_NAME = "ExampleFirstName";
const EXAMPLE_LAST_NAME = "ExampleLastName";
const EXAMPLE_PASSWORD = "ExamplePassword";
const EXAMPLE_EMAIL = "email@example.com";
const EXAMPLE_PREVIEW_EMAIL = "email@amplication.com";
const EXAMPLE_ID = "ExampleId";

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD,
  githubId: null,
  previewAccountType: EnumPreviewAccountType.None,
  previewAccountEmail: null,
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  userRoles: [EXAMPLE_USER_ROLE],
  account: EXAMPLE_ACCOUNT,
  isOwner: true,
};

const prismaUserFindOneMock = jest.fn(() => ({
  then: (resolve) => resolve(EXAMPLE_USER),
  account: () => EXAMPLE_ACCOUNT,
}));

const prismaUserFindManyMock = jest.fn(() => {
  return [EXAMPLE_USER];
});

const prismaUserUpdateMock = jest.fn(() => {
  return EXAMPLE_USER;
});

const prismaUserRoleFindOneMock = jest.fn(() => {
  return EXAMPLE_USER_ROLE;
});

const prismaUserRoleFindManyMock = jest.fn(
  (args: Prisma.UserRoleFindManyArgs) => {
    if (args.where.role === EXISTING_ROLE || args.where.role === undefined) {
      return [EXAMPLE_USER_ROLE];
    }
    return [];
  }
);

const prismaUserRoleCreateMock = jest.fn(() => {
  return EXAMPLE_USER_ROLE;
});

const prismaUserRoleDeleteMock = jest.fn(() => {
  return EXAMPLE_USER_ROLE;
});

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: KafkaProducerService,
          useClass: jest.fn(),
        },
        UserService,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            user: {
              findUnique: prismaUserFindOneMock,
              findFirst: prismaUserFindOneMock,
              findMany: prismaUserFindManyMock,
              update: prismaUserUpdateMock,
            },
            userRole: {
              findUnique: prismaUserRoleFindOneMock,
              findMany: prismaUserRoleFindManyMock,
              create: prismaUserRoleCreateMock,
              delete: prismaUserRoleDeleteMock,
            },
          })),
        },
        {
          provide: BillingService,
          useClass: jest.fn(),
        },
        MockedAmplicationLoggerProvider,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return the preview email as account email when account preview email is not null", async () => {
    prismaUserFindOneMock.mockImplementationOnce(() => ({
      then: (resolve) => resolve(EXAMPLE_USER),
      account: () => ({
        ...EXAMPLE_ACCOUNT,
        previewAccountType: EnumPreviewAccountType.BreakingTheMonolith,
        previewAccountEmail: EXAMPLE_PREVIEW_EMAIL,
      }),
    }));

    const account = await service.getAccount(EXAMPLE_USER_ID);

    expect(account.email).toEqual(EXAMPLE_PREVIEW_EMAIL);
  });

  it("should find one", async () => {
    const args = { where: { id: EXAMPLE_USER_ID } };
    expect(await service.findUser(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith({
      where: { ...args.where, deletedAt: null },
    });
  });

  it("should find one including deleted when requested", async () => {
    const args = { where: { id: EXAMPLE_USER_ID } };
    expect(await service.findUser(args, true)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith({
      where: { ...args.where, deletedAt: undefined },
    });
  });

  it("should find many", async () => {
    const args = { where: { id: EXAMPLE_USER_ID } };
    expect(await service.findUsers(args)).toEqual([EXAMPLE_USER]);
    expect(prismaUserFindManyMock).toBeCalledTimes(1);
    expect(prismaUserFindManyMock).toBeCalledWith({
      where: { ...args.where, deletedAt: null },
    });
  });

  it("should delete a user", async () => {
    const args = { where: { id: EXAMPLE_USER_ID, deletedAt: null } };
    expect(await service.delete(EXAMPLE_USER_ID)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(args);
    expect(prismaUserUpdateMock).toBeCalledTimes(1);
    expect(prismaUserUpdateMock).toBeCalledWith({
      where: {
        id: EXAMPLE_USER_ID,
      },
      data: {
        deletedAt: expect.any(Date),
      },
    });
  });

  it("should assign one role to a user", async () => {
    const args = {
      data: { role: NON_EXISTING_ROLE },
      where: { id: EXAMPLE_ROLE_ID },
    };
    const findOneArgs = {
      where: {
        id: args.where.id,
        deletedAt: null,
      },
    };
    const findManyRolesArgs: Prisma.UserRoleFindManyArgs = {
      where: { user: { id: EXAMPLE_ROLE_ID }, role: args.data.role },
    };
    const roleData: Prisma.UserRoleCreateArgs = {
      data: {
        role: args.data.role,
        user: { connect: { id: args.where.id } },
      },
    };
    expect(await service.assignRole(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(findOneArgs);
    expect(prismaUserRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaUserRoleFindManyMock).toBeCalledWith(findManyRolesArgs);
    expect(prismaUserRoleCreateMock).toBeCalledTimes(1);
    expect(prismaUserRoleCreateMock).toBeCalledWith(roleData);
  });

  it("should not assign a role to a user with existing role", async () => {
    const args = {
      data: { role: EXISTING_ROLE },
      where: { id: EXAMPLE_USER_ID },
    };
    const findOneArgs = {
      where: {
        id: args.where.id,
        deletedAt: null,
      },
    };
    const findManyRolesArgs: Prisma.UserRoleFindManyArgs = {
      where: {
        user: { id: EXAMPLE_USER_ID },
        role: args.data.role,
      },
    };
    expect(await service.assignRole(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(findOneArgs);
    expect(prismaUserRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaUserRoleFindManyMock).toBeCalledWith(findManyRolesArgs);
    expect(prismaUserRoleCreateMock).toBeCalledTimes(0);
  });

  it("should remove one role from a user", async () => {
    const args = {
      data: { role: EXISTING_ROLE },
      where: { id: EXAMPLE_USER_ID },
    };
    const findOneArgs = {
      where: {
        id: args.where.id,
        deletedAt: null,
      },
    };
    const findManyRolesArgs: Prisma.UserRoleFindManyArgs = {
      where: {
        user: { id: EXAMPLE_USER_ID },
        role: args.data.role,
      },
    };
    expect(await service.removeRole(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(findOneArgs);
    expect(prismaUserRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaUserRoleFindManyMock).toBeCalledWith(findManyRolesArgs);
    expect(prismaUserRoleDeleteMock).toBeCalledTimes(1);
    expect(prismaUserRoleDeleteMock).toBeCalledWith({
      where: { id: EXAMPLE_ROLE_ID },
    });
  });

  it("should not remove an already removed role from a user", async () => {
    const args = {
      data: { role: NON_EXISTING_ROLE },
      where: { id: EXAMPLE_USER_ID },
    };
    const findOneArgs = {
      where: {
        id: args.where.id,
        deletedAt: null,
      },
    };
    const findManyRolesArgs: Prisma.UserRoleFindManyArgs = {
      where: {
        user: { id: EXAMPLE_USER_ID },
        role: args.data.role,
      },
    };
    expect(await service.removeRole(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(findOneArgs);
    expect(prismaUserRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaUserRoleFindManyMock).toBeCalledWith(findManyRolesArgs);
    expect(prismaUserRoleDeleteMock).toBeCalledTimes(0);
  });

  it("should find many roles", async () => {
    const args: Prisma.UserRoleFindManyArgs = {
      where: { user: { id: EXAMPLE_ROLE_ID } },
    };
    expect(await service.getRoles(EXAMPLE_ROLE_ID)).toEqual([
      EXAMPLE_USER_ROLE,
    ]);
    expect(prismaUserRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaUserRoleFindManyMock).toBeCalledWith(args);
  });

  it("should set lastActive", async () => {
    const args = {
      userId: EXAMPLE_USER_ID,
      lastActive: new Date(),
    };
    const returnArgs = {
      data: {
        lastActive: args.lastActive,
      },
      where: { id: args.userId },
    };
    expect(await service.setLastActivity(args.userId, args.lastActive)).toEqual(
      EXAMPLE_USER
    );
    expect(prismaUserUpdateMock).toBeCalledTimes(1);
    expect(prismaUserUpdateMock).toBeCalledWith(returnArgs);
  });
});
