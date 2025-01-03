import { Test, TestingModule } from "@nestjs/testing";
import { PermissionsService } from "./permissions.service";
import { PrismaService } from "../../prisma/prisma.service";
import { Account, Workspace } from "../../models";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { AuthUser } from "../auth/types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";

const UNEXPECTED_ORIGIN_ID = "unexpectedOriginId";

const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_WORKSPACE_NAME = "exampleWorkspaceName";

const EXAMPLE_RESOURCE_ID = "exampleResourceId";

const EXAMPLE_RESOURCE_ROLE_ID = "exampleResourceRoleId";

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_WORKSPACE_NAME,
  allowLLMFeatures: true,
};

const EXAMPLE_COUNT = 1;

const EXAMPLE_USER_ID = "exampleUserId";

const EXAMPLE_ACCOUNT: Account = {
  id: "alice",
  email: "example@amplication.com",
  password: "PASSWORD",
  firstName: "Alice",
  lastName: "Appleseed",
  createdAt: new Date(),
  updatedAt: new Date(),
  githubId: null,
};

const EXAMPLE_USER: AuthUser = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: EXAMPLE_WORKSPACE,
  isOwner: true,
  permissions: [],
  account: EXAMPLE_ACCOUNT,
};

const prismaResourceCountMock = jest.fn(() => {
  return EXAMPLE_COUNT;
});

const prismaResourceRoleFindFirstMock = jest.fn(() => {
  return {
    id: EXAMPLE_RESOURCE_ROLE_ID,
  };
});

describe("PermissionsService", () => {
  let service: PermissionsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        MockedAmplicationLoggerProvider,
        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            resource: {
              count: prismaResourceCountMock,
            },
            resourceRole: {
              findFirst: prismaResourceRoleFindFirstMock,
            },
          })),
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return true when originType is an authorized workspace id", async () => {
    const args = {
      user: EXAMPLE_USER,
      originType: AuthorizableOriginParameter.WorkspaceId,
      originId: EXAMPLE_WORKSPACE_ID,
    };
    expect(
      await service.validateAccess(
        args.user,
        args.originType,
        args.originId,
        undefined
      )
    ).toEqual(true);
  });

  it("should return true when originType is an authorized resource id", async () => {
    const args = {
      user: EXAMPLE_USER,
      originType: AuthorizableOriginParameter.ResourceId,
      originId: EXAMPLE_RESOURCE_ID,
    };
    const countArgs = {
      where: {
        deletedAt: null,
        archived: {
          not: true,
        },
        id: args.originId,
        project: {
          workspace: {
            id: EXAMPLE_WORKSPACE_ID,
          },
        },
      },
    };
    expect(
      await service.validateAccess(
        args.user,
        args.originType,
        args.originId,
        undefined
      )
    ).toEqual(true);
    expect(prismaResourceCountMock).toHaveBeenCalledTimes(1);
    expect(prismaResourceCountMock).toHaveBeenCalledWith(countArgs);
  });

  it("should return true if originType is an authorized instance of AuthorizableOriginParameter", async () => {
    const args = {
      user: EXAMPLE_USER,
      originType: AuthorizableOriginParameter.ResourceRoleId,
      originId: EXAMPLE_RESOURCE_ROLE_ID,
    };
    const countArgs = {
      where: {
        id: args.originId,
        resource: {
          deletedAt: null,
          project: {
            workspace: {
              id: EXAMPLE_WORKSPACE_ID,
            },
          },
        },
      },
      select: {
        resourceId: true,
      },
    };
    expect(
      await service.validateAccess(
        args.user,
        args.originType,
        args.originId,
        undefined
      )
    ).toEqual(true);
    expect(prismaResourceRoleFindFirstMock).toHaveBeenCalledTimes(1);
    expect(prismaResourceRoleFindFirstMock).toHaveBeenCalledWith(countArgs);
  });

  it("should return false when originType is an unauthorized origin id", async () => {
    const args = {
      user: EXAMPLE_USER,
      originType: AuthorizableOriginParameter.WorkspaceId,
      originId: UNEXPECTED_ORIGIN_ID,
    };
    expect(
      await service.validateAccess(
        args.user,
        args.originType,
        args.originId,
        undefined
      )
    ).toEqual(false);
  });
});
