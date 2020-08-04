import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/services/prisma.service';
import { User, UserRole } from 'src/models';
import { Role } from 'src/enums/Role';
import { Account } from 'src/models/Account';

const EXAMPLE_USER_ID = 'exampleUserId';
const EXAMPLE_ROLE_ID = 'exampleRoleId';
const EXAMPLE_USER_ROLE: UserRole = {
  id: EXAMPLE_ROLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  role: Role.USER
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  userRoles: [EXAMPLE_USER_ROLE]
};

const prismaUserFindOneMock = jest.fn(() => {
  return EXAMPLE_USER;
});

const prismaUserFindManyMock = jest.fn(() => {
  return [EXAMPLE_USER];
});

const prismaUserRoleFindOneMock = jest.fn(() => {
  return EXAMPLE_USER_ROLE;
});

const prismaUserRoleFindManyMock = jest.fn(() => {
  return [EXAMPLE_USER_ROLE];
});

const prismaUserRoleCreateMock = jest.fn(() => {
  return EXAMPLE_USER_ROLE;
});

const prismaUserRoleDeleteMock = jest.fn(() => {
  return EXAMPLE_USER_ROLE;
});

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    prismaUserFindOneMock.mockClear();
    prismaUserFindManyMock.mockClear();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            user: {
              findOne: prismaUserFindOneMock,
              findMany: prismaUserFindManyMock
            },
            userRole: {
              findOne: prismaUserRoleFindOneMock,
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
    expect(await service.findUsers({ where: {} })).toEqual([EXAMPLE_USER]);
    expect(prismaUserFindManyMock).toBeCalledTimes(1);
  });

  it('should assign one role to a user', async () => {
    expect(
      await service.assignRole({
        data: { role: Role.USER },
        where: { id: EXAMPLE_ROLE_ID }
      })
    ).toEqual(EXAMPLE_USER);
  });

  it('should remove one role from a user', async () => {
    expect(
      await service.removeRole({
        data: { role: Role.USER },
        where: { id: EXAMPLE_ROLE_ID }
      })
    ).toEqual(EXAMPLE_USER);
  });

  it('should find many roles', async () => {
    expect(await service.getRoles(EXAMPLE_ROLE_ID)).toEqual([
      EXAMPLE_USER_ROLE
    ]);
  });
});
