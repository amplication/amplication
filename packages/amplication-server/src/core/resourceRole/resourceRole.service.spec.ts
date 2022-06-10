import { Test, TestingModule } from '@nestjs/testing';
import { ResourceRoleService } from './resourceRole.service';
import { PrismaService } from '@amplication/prisma-db';
import { ResourceRole } from 'src/models';

const EXAMPLE_APP_ROLE_ID = 'exampleAppRoleId';
const EXAMPLE_APP_ROLE_NAME = 'exampleAppRoleName';
const EXAMPLE_APP_ROLE_DISPLAY_NAME = 'exampleAppRoleDisplayName';
const EXAMPLE_APP_ROLE_DESCRIPTION = 'exampleAppRoleDescription';

const EXAMPLE_APP_ROLE: ResourceRole = {
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
  let service: ResourceRoleService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ResourceRoleService,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            resourceRole: {
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

    service = module.get<ResourceRoleService>(ResourceRoleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an resource role', async () => {
    const args = {
      data: {
        name: EXAMPLE_APP_ROLE_NAME,
        description: EXAMPLE_APP_ROLE_DESCRIPTION,
        displayName: EXAMPLE_APP_ROLE_DISPLAY_NAME,
        resource: { connect: { id: EXAMPLE_APP_ROLE_ID } }
      }
    };
    expect(await service.createResourceRole(args)).toEqual(EXAMPLE_APP_ROLE);
    expect(prismaAppRoleCreateMock).toBeCalledTimes(1);
    expect(prismaAppRoleCreateMock).toBeCalledWith(args);
  });

  it('should find one resource role', async () => {
    const args = { where: { id: EXAMPLE_APP_ROLE_ID } };
    expect(await service.getResourceRole(args)).toEqual(EXAMPLE_APP_ROLE);
    expect(prismaAppRoleFindOneMock).toBeCalledTimes(1);
    expect(prismaAppRoleFindOneMock).toBeCalledWith(args);
  });

  it('should find many resource roles', async () => {
    const args = {};
    expect(await service.getResourceRoles(args)).toEqual([EXAMPLE_APP_ROLE]);
    expect(prismaAppRoleFindManyMock).toBeCalledTimes(1);
    expect(prismaAppRoleFindManyMock).toBeCalledWith(args);
  });

  it('should delete an resource role', async () => {
    const args = { where: { id: EXAMPLE_APP_ROLE_ID } };
    expect(await service.deleteResourceRole(args)).toEqual(EXAMPLE_APP_ROLE);
    expect(prismaAppRoleDeleteMock).toBeCalledTimes(1);
    expect(prismaAppRoleDeleteMock).toBeCalledWith(args);
  });

  it('should update an resource role', async () => {
    const args = {
      data: { displayName: EXAMPLE_APP_ROLE_DISPLAY_NAME },
      where: { id: EXAMPLE_APP_ROLE_ID }
    };
    expect(await service.updateResourceRole(args)).toEqual(EXAMPLE_APP_ROLE);
    expect(prismaAppRoleUpdateMock).toBeCalledTimes(1);
    expect(prismaAppRoleUpdateMock).toBeCalledWith(args);
  });
});
