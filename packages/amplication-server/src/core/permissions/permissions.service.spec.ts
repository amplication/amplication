import { Test, TestingModule } from "@nestjs/testing";
import { PermissionsService } from "./permissions.service";
import { PrismaService } from "../../prisma/prisma.service";
import { Account, Resource, Workspace } from "../../models";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { AuthUser } from "../auth/types";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { RolesPermissions } from "@amplication/util-roles-types";
import { EnumResourceType } from "../../prisma";
import { TeamAssignment } from "../../models/TeamAssignment";

const UNEXPECTED_ORIGIN_ID = "unexpectedOriginId";

const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_WORKSPACE_NAME = "exampleWorkspaceName";

const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_PROJECT_ID = "exampleProjectId";

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

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "exampleName",
  codeGeneratorName: "NodeJS",
  description: "",
  resourceType: EnumResourceType.Service,
  gitRepositoryOverride: false,
  licensed: true,
};

const EXAMPLE_TEAM_ASSIGNMENT: TeamAssignment = {
  id: "exampleTeamAssignmentId",
  createdAt: new Date(),
  updatedAt: new Date(),
  teamId: "exampleTeamId",
  resourceId: "exampleResourceId",
  roles: [
    {
      id: EXAMPLE_RESOURCE_ROLE_ID,
      key: "exampleResourceRoleKey",
      createdAt: new Date(),
      updatedAt: new Date(),
      name: "exampleResourceRoleName",
      permissions: ["resource.create"],
    },
  ],
};

const prismaMock = {
  teamAssignment: {
    findMany: jest.fn(() => {
      return [EXAMPLE_TEAM_ASSIGNMENT];
    }),
  },
  resource: {
    count: jest.fn(() => {
      return EXAMPLE_COUNT;
    }),
    findFirst: jest.fn(() => {
      return EXAMPLE_RESOURCE;
    }),
  },
  resourceRole: {
    findFirst: jest.fn(() => {
      return {
        id: EXAMPLE_RESOURCE_ROLE_ID,
      };
    }),
  },
  project: {
    count: jest.fn(() => {
      return EXAMPLE_COUNT;
    }),
  },
};

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
          useClass: jest.fn().mockImplementation(() => prismaMock),
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
    expect(prismaMock.resource.count).toHaveBeenCalledTimes(1);
    expect(prismaMock.resource.count).toHaveBeenCalledWith(countArgs);
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
    expect(prismaMock.resourceRole.findFirst).toHaveBeenCalledTimes(1);
    expect(prismaMock.resourceRole.findFirst).toHaveBeenCalledWith(countArgs);
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

  it("should return false when no originId is provided and originType is not None", async () => {
    const args = {
      user: EXAMPLE_USER,
      originType: AuthorizableOriginParameter.WorkspaceId,
      originId: "",
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

  it("should return false when validation function returns false", async () => {
    const args = {
      user: EXAMPLE_USER,
      originType: AuthorizableOriginParameter.WorkspaceId,
      originId: "AnotherWorkspaceId",
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

  it("should return true if user has wildcard permission", async () => {
    const userWithWildcardPermission = {
      ...EXAMPLE_USER,
      permissions: ["*"] as RolesPermissions[],
    };
    const args = {
      user: userWithWildcardPermission,
      originType: AuthorizableOriginParameter.WorkspaceId,
      originId: EXAMPLE_WORKSPACE_ID,
    };
    expect(
      await service.validateAccess(args.user, args.originType, args.originId, [
        "git.org.create",
      ])
    ).toEqual(true);
  });

  it("should return false if user does not have required permissions", async () => {
    const userWithWildcardPermission = {
      ...EXAMPLE_USER,
      permissions: ["resource.create"] as RolesPermissions[],
    };
    const args = {
      user: userWithWildcardPermission,
      originType: AuthorizableOriginParameter.WorkspaceId,
      originId: EXAMPLE_WORKSPACE_ID,
    };
    expect(
      await service.validateAccess(args.user, args.originType, args.originId, [
        "git.org.create",
      ])
    ).toEqual(false);
  });

  it("should return true if no specific permissions are required", async () => {
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
        []
      )
    ).toEqual(true);
  });

  it("should return true if user has required permissions on team level", async () => {
    const userWithOtherPermissions = {
      ...EXAMPLE_USER,
      permissions: ["git.org.create"] as RolesPermissions[],
    };
    const args = {
      user: userWithOtherPermissions,
      originType: AuthorizableOriginParameter.ProjectId,
      originId: EXAMPLE_PROJECT_ID,
      requiredPermissions: ["git.org.create"] as RolesPermissions[],
    };
    expect(
      await service.validateAccess(
        args.user,
        args.originType,
        args.originId,
        args.requiredPermissions
      )
    ).toEqual(true);
  });

  it("should return true if user has required permissions on resource level", async () => {
    const userWithPermissions = {
      ...EXAMPLE_USER,
      permissions: [],
    };
    const args = {
      user: userWithPermissions,
      originType: AuthorizableOriginParameter.ResourceId,
      originId: EXAMPLE_RESOURCE_ID,
      requiredPermissions: ["resource.create"] as RolesPermissions[],
    };
    prismaMock.resource.count.mockReturnValueOnce(1);
    prismaMock.resourceRole.findFirst.mockReturnValueOnce({
      id: EXAMPLE_RESOURCE_ROLE_ID,
    });
    expect(
      await service.validateAccess(
        args.user,
        args.originType,
        args.originId,
        args.requiredPermissions
      )
    ).toEqual(true);
  });
});
