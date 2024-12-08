import { Test, TestingModule } from "@nestjs/testing";
import { Blueprint, Workspace } from "../../models";
import { PrismaService } from "../../prisma/prisma.service";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";
import { prepareDeletedItemName } from "../../util/softDelete";
import { BlueprintService } from "./blueprint.service";
import { CustomPropertyService } from "../customProperty/customProperty.service";

const EXAMPLE_BLUEPRINT_ID = "exampleBlueprintId";
const EXAMPLE_BLUEPRINT_KEY = "exampleBlueprintKey";
const EXAMPLE_NAME = "exampleName";
const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_BLUEPRINT_NAME = "exampleBlueprintName";

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  allowLLMFeatures: true,
};

const EXAMPLE_BLUEPRINT: Blueprint = {
  id: EXAMPLE_BLUEPRINT_ID,
  name: EXAMPLE_BLUEPRINT_NAME,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: EXAMPLE_WORKSPACE,
  workspaceId: EXAMPLE_WORKSPACE_ID,
  key: EXAMPLE_BLUEPRINT_KEY,
  enabled: true,
  relations: null,
};

const prismaBlueprintUpdateMock = jest.fn(() => {
  return EXAMPLE_BLUEPRINT;
});
const prismaBlueprintFindFirstMock = jest.fn(() => {
  return EXAMPLE_BLUEPRINT;
});
const prismaBlueprintCreateMock = jest.fn(() => {
  return EXAMPLE_BLUEPRINT;
});
const prismaBlueprintFindManyMock = jest.fn(() => {
  return [EXAMPLE_BLUEPRINT];
});

const prismaMock = {
  blueprint: {
    create: prismaBlueprintCreateMock,
    findMany: prismaBlueprintFindManyMock,
    findUnique: prismaBlueprintFindFirstMock,
    update: prismaBlueprintUpdateMock,
  },
};

describe("BlueprintService", () => {
  let service: BlueprintService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlueprintService,

        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: CustomPropertyService,
          useValue: {},
        },

        MockedSegmentAnalyticsProvider(),
      ],
    }).compile();

    service = module.get<BlueprintService>(BlueprintService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a blueprint", async () => {
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
    const newBlueprint = await service.createBlueprint(args);

    // assert
    expect(newBlueprint).toEqual(EXAMPLE_BLUEPRINT);
    expect(prismaMock.blueprint.create).toHaveBeenCalledTimes(1);
    expect(prismaMock.blueprint.create).toHaveBeenCalledWith(args);
  });

  it("should delete a blueprint", async () => {
    const args = { where: { id: EXAMPLE_BLUEPRINT_ID } };
    const dateSpy = jest.spyOn(global, "Date");
    expect(await service.deleteBlueprint(args)).toEqual(EXAMPLE_BLUEPRINT);

    expect(prismaMock.blueprint.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.blueprint.update).toHaveBeenCalledWith({
      ...args,
      data: {
        deletedAt: dateSpy.mock.instances[0],
        name: prepareDeletedItemName(
          EXAMPLE_BLUEPRINT.name,
          EXAMPLE_BLUEPRINT.id
        ),
        key: prepareDeletedItemName(
          EXAMPLE_BLUEPRINT.key,
          EXAMPLE_BLUEPRINT.id
        ),
      },
    });
  });

  it("should get a single blueprint", async () => {
    const args = { where: { id: EXAMPLE_BLUEPRINT_ID } };
    expect(await service.blueprint(args)).toEqual(EXAMPLE_BLUEPRINT);
    expect(prismaMock.blueprint.findUnique).toHaveBeenCalledTimes(1);
    expect(prismaMock.blueprint.findUnique).toHaveBeenCalledWith({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  });

  it("should find blueprints", async () => {
    const args = {
      where: {
        name: {
          contains: EXAMPLE_BLUEPRINT_NAME,
        },
      },
    };
    expect(await service.blueprints(args)).toEqual([EXAMPLE_BLUEPRINT]);
    expect(prismaMock.blueprint.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.blueprint.findMany).toHaveBeenCalledWith({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  });

  it("should update a blueprint", async () => {
    const args = {
      data: {
        name: EXAMPLE_NAME,
      },
      where: {
        id: EXAMPLE_BLUEPRINT_ID,
      },
    };
    expect(await service.updateBlueprint(args)).toEqual(EXAMPLE_BLUEPRINT);
    expect(prismaMock.blueprint.update).toHaveBeenCalledTimes(1);
    expect(prismaMock.blueprint.update).toHaveBeenCalledWith(args);
  });
});
