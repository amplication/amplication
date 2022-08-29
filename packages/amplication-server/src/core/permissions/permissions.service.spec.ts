import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from '@amplication/prisma-db';
import { User, Workspace } from 'src/models';
import { AuthorizableOriginParameter } from 'src/enums/AuthorizableOriginParameter';

const UNEXPECTED_ORIGIN_TYPE = -1;
const UNEXPECTED_ORIGIN_ID = 'unexpectedOriginId';

const EXAMPLE_WORKSPACE_ID = 'exampleWorkspaceId';
const EXAMPLE_WORKSPACE_NAME = 'exampleWorkspaceName';

const EXAMPLE_RESOURCE_ID = 'exampleResourceId';

const EXAMPLE_RESOURCE_ROLE_ID = 'exampleResourceRoleId';

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
  workspace: EXAMPLE_WORKSPACE,
  isOwner: true
};

const prismaResourceCountMock = jest.fn(() => {
  return EXAMPLE_COUNT;
});

const prismaResourceRoleCountMock = jest.fn(() => {
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
            resource: {
              count: prismaResourceCountMock
            },
            resourceRole: {
              count: prismaResourceRoleCountMock
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

  it('should return true when originType is an authorized workspace id', async () => {
    const args = {
      user: EXAMPLE_USER,
      originType: AuthorizableOriginParameter.WorkspaceId,
      originId: EXAMPLE_WORKSPACE_ID
    };
    expect(
      await service.validateAccess(args.user, args.originType, args.originId)
    ).toEqual(true);
  });

  it('should return true when originType is an authorized resource id', async () => {
    const args = {
      user: EXAMPLE_USER,
      originType: AuthorizableOriginParameter.ResourceId,
      originId: EXAMPLE_RESOURCE_ID
    };
    const countArgs = {
      where: {
        deletedAt: null,
        id: args.originId,
        project: {
          workspace: {
            id: EXAMPLE_WORKSPACE_ID
          }
        }
      }
    };
    expect(
      await service.validateAccess(args.user, args.originType, args.originId)
    ).toEqual(true);
    expect(prismaResourceCountMock).toBeCalledTimes(1);
    expect(prismaResourceCountMock).toBeCalledWith(countArgs);
  });

  it('should return true if originType is an authorized instance of AuthorizableOriginParameter', async () => {
    const args = {
      user: EXAMPLE_USER,
      originType: AuthorizableOriginParameter.ResourceRoleId,
      originId: EXAMPLE_RESOURCE_ROLE_ID
    };
    const countArgs = {
      where: {
        id: args.originId,
        resource: {
          deletedAt: null,
          project: {
            workspace: {
              id: EXAMPLE_WORKSPACE_ID
            }
          }
        }
      }
    };
    expect(
      await service.validateAccess(args.user, args.originType, args.originId)
    ).toEqual(true);
    expect(prismaResourceRoleCountMock).toBeCalledTimes(1);
    expect(prismaResourceRoleCountMock).toBeCalledWith(countArgs);
  });

  it('should throw an error', async () => {
    const args = {
      user: EXAMPLE_USER,
      originType: UNEXPECTED_ORIGIN_TYPE,
      originId: UNEXPECTED_ORIGIN_ID
    };
    await expect(
      service.validateAccess(args.user, args.originType, args.originId)
    ).rejects.toThrow(`Unexpected origin type ${args.originType}`);
  });
});
