import { Test, TestingModule } from '@nestjs/testing';
import { AppRoleService } from './appRole.service';
import { PrismaService } from 'nestjs-prisma';
import { AppRole } from 'src/models';

const EXAMPLE_APP_ROLE_ID = 'exampleAppRoleId';
const EXAMPLE_APP_ROLE_NAME = 'exampleAppRoleName';
const EXAMPLE_APP_ROLE_DISPLAY_NAME = 'exampleAppRoleDisplayName';
const EXAMPLE_APP_ROLE_DESCRIPTION = 'exampleAppRoleDescription';

const EXAMPLE_APP_ROLE: AppRole = {
  id: EXAMPLE_APP_ROLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_APP_ROLE_NAME,
  displayName: EXAMPLE_APP_ROLE_DISPLAY_NAME
};

const prismaAppRoleCreateMock = jest.fn(() => {
  return EXAMPLE_APP_ROLE;
});
const prismaAppRoleFindOneMock = jest.fn(() => {
  return EXAMPLE_APP_ROLE;
});
const prismaAppRoleFindManyMock = jest.fn(() => {
  return [EXAMPLE_APP_ROLE];
});
const prismaAppRoleDeleteMock = jest.fn(() => {
  return EXAMPLE_APP_ROLE;
});
const prismaAppRoleUpdateMock = jest.fn(() => {
  return EXAMPLE_APP_ROLE;
});

describe('AppRoleService', () => {
  let service: AppRoleService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppRoleService,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            appRole: {
              create: prismaAppRoleCreateMock,
              findUnique: prismaAppRoleFindOneMock,
              findMany: prismaAppRoleFindManyMock,
              delete: prismaAppRoleDeleteMock,
              update: prismaAppRoleUpdateMock
            }
          }))
        }
      ]
    }).compile();

    service = module.get<AppRoleService>(AppRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an app role', async () => {
    const args = {
      data: {
        name: EXAMPLE_APP_ROLE_NAME,
        description: EXAMPLE_APP_ROLE_DESCRIPTION,
        displayName: EXAMPLE_APP_ROLE_DISPLAY_NAME,
        app: { connect: { id: EXAMPLE_APP_ROLE_ID } }
      }
    };
    expect(await service.createAppRole(args)).toEqual(EXAMPLE_APP_ROLE);
    expect(prismaAppRoleCreateMock).toBeCalledTimes(1);
    expect(prismaAppRoleCreateMock).toBeCalledWith(args);
  });

  it('should find one app role', async () => {
    const args = { where: { id: EXAMPLE_APP_ROLE_ID } };
    expect(await service.getAppRole(args)).toEqual(EXAMPLE_APP_ROLE);
    expect(prismaAppRoleFindOneMock).toBeCalledTimes(1);
    expect(prismaAppRoleFindOneMock).toBeCalledWith(args);
  });

  it('should find many app roles', async () => {
    const args = {};
    expect(await service.getAppRoles(args)).toEqual([EXAMPLE_APP_ROLE]);
    expect(prismaAppRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaAppRoleFindManyMock).toBeCalledWith(args);
  });

  it('should delete an app role', async () => {
    const args = { where: { id: EXAMPLE_APP_ROLE_ID } };
    expect(await service.deleteAppRole(args)).toEqual(EXAMPLE_APP_ROLE);
    expect(prismaAppRoleDeleteMock).toBeCalledTimes(1);
    expect(prismaAppRoleDeleteMock).toBeCalledWith(args);
  });

  it('should update an app role', async () => {
    const args = {
      data: { displayName: EXAMPLE_APP_ROLE_DISPLAY_NAME },
      where: { id: EXAMPLE_APP_ROLE_ID }
    };
    expect(await service.updateAppRole(args)).toEqual(EXAMPLE_APP_ROLE);
    expect(prismaAppRoleUpdateMock).toBeCalledTimes(1);
    expect(prismaAppRoleUpdateMock).toBeCalledWith(args);
  });
});
