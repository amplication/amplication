import { Test, TestingModule } from "@nestjs/testing";
import { Role, Workspace } from "../../models";
import { PrismaService } from "../../prisma/prisma.service";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";
import { prepareDeletedItemName } from "../../util/softDelete";
import { RoleService } from "./role.service";

const EXAMPLE_ROLE_ID = "exampleRoleId";
const EXAMPLE_ROLE_KEY = "exampleRoleKey";
const EXAMPLE_NAME = "exampleName";
const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_ROLE_NAME = "exampleRoleName";

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  allowLLMFeatures: true,
};

const EXAMPLE_ROLE: Role = {
  id: EXAMPLE_ROLE_ID,
  name: EXAMPLE_ROLE_NAME,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: EXAMPLE_WORKSPACE,
  workspaceId: EXAMPLE_WORKSPACE_ID,
  key: EXAMPLE_ROLE_KEY,
};

const prismaRoleUpdateMock = jest.fn(() => {
  return EXAMPLE_ROLE;
});
const prismaRoleFindFirstMock = jest.fn(() => {
  return EXAMPLE_ROLE;
});
const prismaRoleCreateMock = jest.fn(() => {
  return EXAMPLE_ROLE;
});
const prismaRoleFindManyMock = jest.fn(() => {
  return [EXAMPLE_ROLE];
});

const prismaMock = {
  role: {
    create: prismaRoleCreateMock,
    findMany: prismaRoleFindManyMock,
    findUnique: prismaRoleFindFirstMock,
    update: prismaRoleUpdateMock,
  },
};

describe("RoleService", () => {
  let service: RoleService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoleService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },

        MockedSegmentAnalyticsProvider(),
      ],
    }).compile();

    service = module.get<RoleService>(RoleService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a role", async () => {
    // arrange
    const args = {
      data: {
        enabled: true,
        key: "EXAMPLE_NAME",
        name: EXAMPLE_NAME,
        workspace: {
          connect: {
            id: EXAMPLE_WORKSPACE_ID,
          },
        },
      },
    };

    // act
    const newRole = await service.createRole(args);

    // assert
    expect(newRole).toEqual(EXAMPLE_ROLE);
    expect(prismaMock.role.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.role.create).toHaveBeenCalledWith(args);
  });

  it("should delete a role", async () => {
    const args = { where: { id: EXAMPLE_ROLE_ID } };
    const dateSpy = jest.spyOn(global, "Date");
    expect(await service.deleteRole(args)).toEqual(EXAMPLE_ROLE);

    expect(prismaMock.role.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.role.update).toHaveBeenCalledWith({
      ...args,
      data: {
        deletedAt: dateSpy.mock.instances[0],
        name: prepareDeletedItemName(EXAMPLE_ROLE.name, EXAMPLE_ROLE.id),
        key: prepareDeletedItemName(EXAMPLE_ROLE.key, EXAMPLE_ROLE.id),
      },
    });
  });

  it("should get a single role", async () => {
    const args = { where: { id: EXAMPLE_ROLE_ID } };
    expect(await service.role(args)).toEqual(EXAMPLE_ROLE);
    expect(prismaMock.role.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.role.findUnique).toHaveBeenCalledWith({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  });

  it("should find roles", async () => {
    const args = {
      where: {
        name: {
          contains: EXAMPLE_ROLE_NAME,
        },
      },
    };
    expect(await service.roles(args)).toEqual([EXAMPLE_ROLE]);
    expect(prismaMock.role.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.role.findMany).toHaveBeenCalledWith({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  });

  it("should update a role", async () => {
    const args = {
      data: {
        name: EXAMPLE_NAME,
      },
      where: {
        id: EXAMPLE_ROLE_ID,
      },
    };
    expect(await service.updateRole(args)).toEqual(EXAMPLE_ROLE);
    expect(prismaMock.role.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.role.update).toHaveBeenCalledWith(args);
  });
});
