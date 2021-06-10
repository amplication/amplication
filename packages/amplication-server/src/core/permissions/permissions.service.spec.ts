import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from 'nestjs-prisma';
import { User, Workspace } from 'src/models';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';

const UNEXPECTED_RESOURCE_TYPE = -1;
const UNEXPECTED_RESOURCE_ID = 'unexpectedResourceId';

const EXAMPLE_WORKSPACE_ID = 'exampleWorkspaceId';
const EXAMPLE_WORKSPACE_NAME = 'exampleWorkspaceName';

const EXAMPLE_APP_ID = 'exampleAppId';

const EXAMPLE_APP_ROLE_ID = 'exampleAppRoleId';

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_WORKSPACE_NAME
};

const EXAMPLE_COUNT = 1;

const EXAMPLE_USER_ID = 'exampleUserId';

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: EXAMPLE_WORKSPACE
};

const prismaAppCountMock = jest.fn(() => {
  return EXAMPLE_COUNT;
});

const prismaAppRoleCountMock = jest.fn(() => {
  return EXAMPLE_COUNT;
});

describe('PermissionsService', () => {
  let service: PermissionsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            app: {
              count: prismaAppCountMock
            },
            appRole: {
              count: prismaAppRoleCountMock
            }
          }))
        }
      ]
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true when resourceType is an authorized workspace id', async () => {
    const args = {
      user: EXAMPLE_USER,
      resourceType: AuthorizableResourceParameter.WorkspaceId,
      resourceId: EXAMPLE_WORKSPACE_ID
    };
    expect(
      await service.validateAccess(
        args.user,
        args.resourceType,
        args.resourceId
      )
    ).toEqual(true);
  });

  it('should return true when resourceType is an authorized app id', async () => {
    const args = {
      user: EXAMPLE_USER,
      resourceType: AuthorizableResourceParameter.AppId,
      resourceId: EXAMPLE_APP_ID
    };
    const countArgs = {
      where: {
        id: args.resourceId,
        workspace: {
          id: EXAMPLE_WORKSPACE_ID
        }
      }
    };
    expect(
      await service.validateAccess(
        args.user,
        args.resourceType,
        args.resourceId
      )
    ).toEqual(true);
    expect(prismaAppCountMock).toBeCalledTimes(1);
    expect(prismaAppCountMock).toBeCalledWith(countArgs);
  });

  it('should return true if resourceType is an authorized instance of AuthorizableResourceParameter', async () => {
    const args = {
      user: EXAMPLE_USER,
      resourceType: AuthorizableResourceParameter.AppRoleId,
      resourceId: EXAMPLE_APP_ROLE_ID
    };
    const countArgs = {
      where: {
        id: args.resourceId,
        app: {
          workspace: {
            id: EXAMPLE_WORKSPACE_ID
          }
        }
      }
    };
    expect(
      await service.validateAccess(
        args.user,
        args.resourceType,
        args.resourceId
      )
    ).toEqual(true);
    expect(prismaAppRoleCountMock).toBeCalledTimes(1);
    expect(prismaAppRoleCountMock).toBeCalledWith(countArgs);
  });

  it('should throw an error', async () => {
    const args = {
      user: EXAMPLE_USER,
      resourceType: UNEXPECTED_RESOURCE_TYPE,
      resourceId: UNEXPECTED_RESOURCE_ID
    };
    await expect(
      service.validateAccess(args.user, args.resourceType, args.resourceId)
    ).rejects.toThrow(`Unexpected resource type ${args.resourceType}`);
  });
});
