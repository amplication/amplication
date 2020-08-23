import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { PrismaService } from 'src/services/prisma.service';
import { User, App, Organization } from 'src/models';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';

const UNEXPECTED_RESOURCE_TYPE = 7;
const UNEXPECTED_RESOURCE_ID = 'unexpectedResourceId';

const EXAMPLE_ORGANIZATION_ID = 'exampleOrganizationId';
const EXAMPLE_ORGANIZATION_NAME = 'exampleOrganizationName';
const EXAMPLE_TIMEZONE = 'exampleTimeZone';
const EXAMPLE_ADDRESS = 'exampleAddress';

const EXAMPLE_APP_ID = 'exampleAppId';
const EXAMPLE_APP_NAME = 'exampleAppName';
const EXAMPLE_APP_DESCRIPTION = 'exampleAppDescription';

const EXAMPLE_APP_ROLE_ID = 'exampleAppRoleId';

const EXAMPLE_ORGANIZATION: Organization = {
  id: EXAMPLE_ORGANIZATION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_ORGANIZATION_NAME,
  defaultTimeZone: EXAMPLE_TIMEZONE,
  address: EXAMPLE_ADDRESS
};

const EXAMPLE_APP: App = {
  id: EXAMPLE_APP_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_APP_NAME,
  description: EXAMPLE_APP_DESCRIPTION,
  organization: EXAMPLE_ORGANIZATION
};

const EXAMPLE_COUNT = 1;

const EXAMPLE_USER_ID = 'exampleUserId';

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  organization: EXAMPLE_ORGANIZATION
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

  it('should return true when resourceType is an authorized organization id', async () => {
    const args = {
      user: EXAMPLE_USER,
      resourceType: AuthorizableResourceParameter.OrganizationId,
      resourceId: EXAMPLE_ORGANIZATION_ID
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
        organization: {
          id: EXAMPLE_ORGANIZATION_ID
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
          organization: {
            id: EXAMPLE_ORGANIZATION_ID
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
    expect(() => {
      service.validateAccess(args.user, args.resourceType, args.resourceId);
    }).toThrow(`Unexpected resource type 7`);
  });
});
