import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'nestjs-prisma';
import { User, UserRole, Account } from 'src/models';
import { Role } from 'src/enums/Role';
import { FindOneArgs } from 'src/dto';
import { Prisma } from '@prisma/client';

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_ROLE_ID = 'exampleRoleId';
const EXISTING_ROLE = Role.User;
const NON_EXISTING_ROLE = Role.Admin;
const EXAMPLE_USER_ROLE: UserRole = {
  id: EXAMPLE_ROLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  role: Role.User
};

const EXAMPLE_FIRST_NAME = 'ExampleFirstName';
const EXAMPLE_LAST_NAME = 'ExampleLastName';
const EXAMPLE_PASSWORD = 'ExamplePassword';
const EXAMPLE_EMAIL = 'email@example.com';
const EXAMPLE_ID = 'ExampleId';

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD,
  githubId: null
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  userRoles: [EXAMPLE_USER_ROLE],
  account: EXAMPLE_ACCOUNT
};

const prismaUserFindOneMock = jest.fn(() => ({
  then: resolve => resolve(EXAMPLE_USER),
  account: () => EXAMPLE_ACCOUNT
}));

const prismaUserFindManyMock = jest.fn(() => {
  return [EXAMPLE_USER];
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

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            user: {
              findUnique: prismaUserFindOneMock,
              findMany: prismaUserFindManyMock
            },
            userRole: {
              findUnique: prismaUserRoleFindOneMock,
              findMany: prismaUserRoleFindManyMock,
              create: prismaUserRoleCreateMock,
              delete: prismaUserRoleDeleteMock
            }
          }))
        }
      ]
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one', async () => {
    const args = { where: { id: EXAMPLE_USER_ID } };
    expect(await service.findUser(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(args);
  });

  it('should find many', async () => {
    const args = { where: {} };
    expect(await service.findUsers(args)).toEqual([EXAMPLE_USER]);
    expect(prismaUserFindManyMock).toBeCalledTimes(1);
    expect(prismaUserFindManyMock).toBeCalledWith(args);
  });

  it('should assign one role to a user', async () => {
    const args = {
      data: { role: NON_EXISTING_ROLE },
      where: { id: EXAMPLE_ROLE_ID }
    };
    const findOneArgs: FindOneArgs = {
      where: {
        id: args.where.id
      }
    };
    const findManyRolesArgs: Prisma.UserRoleFindManyArgs = {
      where: { user: { id: EXAMPLE_ROLE_ID }, role: args.data.role }
    };
    const roleData: Prisma.UserRoleCreateArgs = {
      data: {
        role: args.data.role,
        user: { connect: { id: args.where.id } }
      }
    };
    expect(await service.assignRole(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(findOneArgs);
    expect(prismaUserRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaUserRoleFindManyMock).toBeCalledWith(findManyRolesArgs);
    expect(prismaUserRoleCreateMock).toBeCalledTimes(1);
    expect(prismaUserRoleCreateMock).toBeCalledWith(roleData);
  });

  it('should not assign a role to a user with existing role', async () => {
    const args = {
      data: { role: EXISTING_ROLE },
      where: { id: EXAMPLE_USER_ID }
    };
    const findOneArgs: FindOneArgs = {
      where: {
        id: args.where.id
      }
    };
    const findManyRolesArgs: Prisma.UserRoleFindManyArgs = {
      where: {
        user: { id: EXAMPLE_USER_ID },
        role: args.data.role
      }
    };
    expect(await service.assignRole(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(findOneArgs);
    expect(prismaUserRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaUserRoleFindManyMock).toBeCalledWith(findManyRolesArgs);
    expect(prismaUserRoleCreateMock).toBeCalledTimes(0);
  });

  it('should remove one role from a user', async () => {
    const args = {
      data: { role: EXISTING_ROLE },
      where: { id: EXAMPLE_USER_ID }
    };
    const findOneArgs: FindOneArgs = {
      where: {
        id: args.where.id
      }
    };
    const findManyRolesArgs: Prisma.UserRoleFindManyArgs = {
      where: {
        user: { id: EXAMPLE_USER_ID },
        role: args.data.role
      }
    };
    expect(await service.removeRole(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(findOneArgs);
    expect(prismaUserRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaUserRoleFindManyMock).toBeCalledWith(findManyRolesArgs);
    expect(prismaUserRoleDeleteMock).toBeCalledTimes(1);
    expect(prismaUserRoleDeleteMock).toBeCalledWith({
      where: { id: EXAMPLE_ROLE_ID }
    });
  });

  it('should not remove an already removed role from a user', async () => {
    const args = {
      data: { role: NON_EXISTING_ROLE },
      where: { id: EXAMPLE_USER_ID }
    };
    const findOneArgs: FindOneArgs = {
      where: {
        id: args.where.id
      }
    };
    const findManyRolesArgs: Prisma.UserRoleFindManyArgs = {
      where: {
        user: { id: EXAMPLE_USER_ID },
        role: args.data.role
      }
    };
    expect(await service.removeRole(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(findOneArgs);
    expect(prismaUserRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaUserRoleFindManyMock).toBeCalledWith(findManyRolesArgs);
    expect(prismaUserRoleDeleteMock).toBeCalledTimes(0);
  });

  it('should find many roles', async () => {
    const args: Prisma.UserRoleFindManyArgs = {
      where: { user: { id: EXAMPLE_ROLE_ID } }
    };
    expect(await service.getRoles(EXAMPLE_ROLE_ID)).toEqual([
      EXAMPLE_USER_ROLE
    ]);
    expect(prismaUserRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaUserRoleFindManyMock).toBeCalledWith(args);
  });
});
