import { Test, TestingModule } from "@nestjs/testing";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User, Resource, Blueprint } from "../../models";
import { PrismaService } from "../../prisma";
import { BlockService } from "../block/block.service";
import { BlueprintService } from "../blueprint/blueprint.service";
import { RelationService } from "./relation.service";
import { Relation } from "./dto/Relation";
import { UpdateResourceRelationArgs } from "./dto/UpdateResourceRelationArgs";

// Test constants
const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_RESOURCE_ID = "exampleResourceId";
const EXAMPLE_BLUEPRINT_ID = "exampleBlueprintId";
const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_RELATION_ID = "exampleRelationId";
const EXAMPLE_RELATION_KEY = "exampleRelationKey";
const EXAMPLE_RELATED_RESOURCE_ID = "exampleRelatedResourceId";

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: {
    id: EXAMPLE_WORKSPACE_ID,
    createdAt: new Date(),
    updatedAt: new Date(),
    name: "example_workspace_name",
    allowLLMFeatures: true,
  },
  isOwner: true,
};

const EXAMPLE_RESOURCE: Resource = {
  id: EXAMPLE_RESOURCE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: "exampleResourceName",
  description: "exampleResourceDescription",
  resourceType: "Service",
  blueprintId: EXAMPLE_BLUEPRINT_ID,
  gitRepositoryOverride: false,
  licensed: true,
};

const EXAMPLE_BLUEPRINT: Blueprint = {
  id: EXAMPLE_BLUEPRINT_ID,
  name: "exampleBlueprintName",
  createdAt: new Date(),
  updatedAt: new Date(),
  workspaceId: EXAMPLE_WORKSPACE_ID,
  properties: null,
  key: "exampleBlueprintKey",
  enabled: true,
  relations: [
    {
      key: EXAMPLE_RELATION_KEY,
      parentShouldBuildWithChild: true,
      name: "Example Relation",
      relatedTo: "ExampleRelatedTo",
      allowMultiple: true,
      required: false,
      limitSelectionToProject: false,
    },
  ],
  codeGeneratorName: "Blueprint",
  resourceType: "Component",
  useBusinessDomain: false,
};

const EXAMPLE_RELATION: Relation = {
  id: EXAMPLE_RELATION_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  resourceId: EXAMPLE_RESOURCE_ID,
  displayName: EXAMPLE_RELATION_KEY,
  blockType: EnumBlockType.Relation,
  relationKey: EXAMPLE_RELATION_KEY,
  relatedResources: [EXAMPLE_RELATED_RESOURCE_ID],
  versionNumber: 0,
  parentBlock: null,
  lockedByUserId: null,
  lockedAt: null,
  description: "Example relation description",
  inputParameters: null,
  outputParameters: null,
};

// Mock implementations
const prismaResourceFindUniqueMock = jest.fn(() => EXAMPLE_RESOURCE);
const prismaResourceFindManyMock = jest.fn(() => [EXAMPLE_RESOURCE]);
const prismaResourceRelationCacheDeleteManyMock = jest.fn();
const prismaResourceRelationCacheCreateManyMock = jest.fn();
const prismaResourceRelationCacheFindManyMock = jest.fn(() => [
  {
    parentResourceId: "parentResourceId",
    childResourceId: EXAMPLE_RESOURCE_ID,
    relationKey: EXAMPLE_RELATION_KEY,
    parentShouldBuildWithChild: true,
  },
]);

const prismaMock = {
  resource: {
    findUnique: prismaResourceFindUniqueMock,
    findMany: prismaResourceFindManyMock,
  },
  resourceRelationCache: {
    deleteMany: prismaResourceRelationCacheDeleteManyMock,
    createMany: prismaResourceRelationCacheCreateManyMock,
    findMany: prismaResourceRelationCacheFindManyMock,
  },
};

const blockServiceFindManyByBlockTypeAndSettingsMock = jest.fn(() => [
  EXAMPLE_RELATION,
]);
const blockServiceCreateMock = jest.fn(() => EXAMPLE_RELATION);
const blockServiceUpdateMock = jest.fn(() => EXAMPLE_RELATION);
const blockServiceFindManyByBlockTypeMock = jest.fn(() => [EXAMPLE_RELATION]);

const blockServiceMock = {
  findManyByBlockTypeAndSettings:
    blockServiceFindManyByBlockTypeAndSettingsMock,
  findManyByBlockType: blockServiceFindManyByBlockTypeMock,
  create: blockServiceCreateMock,
  update: blockServiceUpdateMock,
};

const blueprintServiceBlueprintMock = jest.fn(() => EXAMPLE_BLUEPRINT);

const blueprintServiceMock = {
  blueprint: blueprintServiceBlueprintMock,
};

describe("RelationService", () => {
  let service: RelationService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RelationService,
        {
          provide: BlockService,
          useValue: blockServiceMock,
        },
        MockedAmplicationLoggerProvider,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: BlueprintService,
          useValue: blueprintServiceMock,
        },
      ],
    }).compile();

    service = module.get<RelationService>(RelationService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should throw an error", async () => {
      await expect(
        service.create({ data: {} } as any, EXAMPLE_USER)
      ).rejects.toThrow(
        "Method not implemented. use updateResourceRelation instead"
      );
    });
  });

  describe("update", () => {
    it("should throw an error", async () => {
      await expect(
        service.update({ where: { id: "id" }, data: {} } as any, EXAMPLE_USER)
      ).rejects.toThrow(
        "Method not implemented. use updateResourceRelation instead"
      );
    });
  });

  describe("updateResourceRelation", () => {
    it("should create a new relation if it doesn't exist", async () => {
      // Arrange
      blockServiceFindManyByBlockTypeAndSettingsMock.mockReturnValueOnce([]);

      const args: UpdateResourceRelationArgs = {
        resource: { id: EXAMPLE_RESOURCE_ID },
        data: {
          relationKey: EXAMPLE_RELATION_KEY,
          relatedResources: [EXAMPLE_RELATED_RESOURCE_ID],
        },
      };

      // Mock the updateResourceRelationCache method
      jest
        .spyOn(service, "updateResourceRelationCache")
        .mockResolvedValueOnce();

      // Act
      const result = await service.updateResourceRelation(args, EXAMPLE_USER);

      // Assert
      expect(result).toEqual(EXAMPLE_RELATION);
      expect(
        blockServiceFindManyByBlockTypeAndSettingsMock
      ).toHaveBeenCalledTimes(1);
      expect(blockServiceCreateMock).toHaveBeenCalledTimes(1);
      expect(blockServiceCreateMock).toHaveBeenCalledWith(
        {
          data: {
            relationKey: EXAMPLE_RELATION_KEY,
            relatedResources: [EXAMPLE_RELATED_RESOURCE_ID],
            displayName: EXAMPLE_RELATION_KEY,
            resource: {
              connect: {
                id: EXAMPLE_RESOURCE_ID,
              },
            },
            blockType: EnumBlockType.Relation,
          },
        },
        EXAMPLE_USER_ID
      );
      expect(service.updateResourceRelationCache).toHaveBeenCalledWith(
        EXAMPLE_RESOURCE_ID
      );
    });

    it("should update an existing relation if it exists", async () => {
      // Arrange
      const args: UpdateResourceRelationArgs = {
        resource: { id: EXAMPLE_RESOURCE_ID },
        data: {
          relationKey: EXAMPLE_RELATION_KEY,
          relatedResources: [EXAMPLE_RELATED_RESOURCE_ID],
        },
      };

      // Mock the updateResourceRelationCache method
      jest
        .spyOn(service, "updateResourceRelationCache")
        .mockResolvedValueOnce();

      // Act
      const result = await service.updateResourceRelation(args, EXAMPLE_USER);

      // Assert
      expect(result).toEqual(EXAMPLE_RELATION);
      expect(
        blockServiceFindManyByBlockTypeAndSettingsMock
      ).toHaveBeenCalledTimes(1);
      expect(blockServiceUpdateMock).toHaveBeenCalledTimes(1);
      expect(blockServiceUpdateMock).toHaveBeenCalledWith(
        {
          where: { id: EXAMPLE_RELATION_ID },
          data: {
            relationKey: EXAMPLE_RELATION_KEY,
            relatedResources: [EXAMPLE_RELATED_RESOURCE_ID],
            displayName: EXAMPLE_RELATION_KEY,
          },
        },
        EXAMPLE_USER,
        undefined
      );
      expect(service.updateResourceRelationCache).toHaveBeenCalledWith(
        EXAMPLE_RESOURCE_ID
      );
    });
  });

  describe("updateWorkspaceResourceRelationCache", () => {
    it("should update relation cache for all resources in the workspace", async () => {
      // Arrange
      jest.spyOn(service, "updateResourceRelationCache").mockResolvedValue();

      // Act
      await service.updateWorkspaceResourceRelationCache(EXAMPLE_WORKSPACE_ID);

      // Assert
      expect(prismaResourceFindManyMock).toHaveBeenCalledTimes(1);
      expect(prismaResourceFindManyMock).toHaveBeenCalledWith({
        where: {
          project: {
            workspaceId: EXAMPLE_WORKSPACE_ID,
          },
          deletedAt: null,
          archived: { not: true },
        },
      });
      expect(service.updateResourceRelationCache).toHaveBeenCalledTimes(1);
      expect(service.updateResourceRelationCache).toHaveBeenCalledWith(
        EXAMPLE_RESOURCE_ID
      );
    });
  });

  describe("updateBlueprintResourceRelationCache", () => {
    it("should update relation cache for all resources in the blueprint", async () => {
      // Arrange
      jest.spyOn(service, "updateResourceRelationCache").mockResolvedValue();

      // Act
      await service.updateBlueprintResourceRelationCache(EXAMPLE_BLUEPRINT_ID);

      // Assert
      expect(prismaResourceFindManyMock).toHaveBeenCalledTimes(1);
      expect(prismaResourceFindManyMock).toHaveBeenCalledWith({
        where: {
          blueprintId: EXAMPLE_BLUEPRINT_ID,
          deletedAt: null,
          archived: { not: true },
        },
      });
      expect(service.updateResourceRelationCache).toHaveBeenCalledTimes(1);
      expect(service.updateResourceRelationCache).toHaveBeenCalledWith(
        EXAMPLE_RESOURCE_ID
      );
    });
  });

  describe("updateResourceRelationCache", () => {
    it("should update the resource relation cache", async () => {
      // Arrange
      blockServiceFindManyByBlockTypeMock.mockReturnValueOnce([
        EXAMPLE_RELATION,
      ]);

      // Act
      await service.updateResourceRelationCache(EXAMPLE_RESOURCE_ID);

      // Assert
      expect(blockServiceFindManyByBlockTypeMock).toHaveBeenCalledTimes(1);
      expect(prismaResourceFindUniqueMock).toHaveBeenCalledTimes(1);
      expect(prismaResourceFindUniqueMock).toHaveBeenCalledWith({
        where: {
          id: EXAMPLE_RESOURCE_ID,
        },
      });
      expect(blueprintServiceBlueprintMock).toHaveBeenCalledTimes(1);
      expect(prismaResourceRelationCacheDeleteManyMock).toHaveBeenCalledTimes(
        2
      );
      expect(prismaResourceRelationCacheCreateManyMock).toHaveBeenCalledTimes(
        1
      );
    });

    it("should log error if resource does not exist", async () => {
      // Arrange
      prismaResourceFindUniqueMock.mockReturnValueOnce(null);
      const loggerErrorSpy = jest.spyOn(service["logger"], "error");

      // Act
      await service.updateResourceRelationCache(EXAMPLE_RESOURCE_ID);

      // Assert
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "Cannot update resource relation cache for resource"
        )
      );
    });

    it("should log error if blueprint does not exist", async () => {
      // Arrange
      blueprintServiceBlueprintMock.mockReturnValueOnce(null);
      const loggerErrorSpy = jest.spyOn(service["logger"], "error");

      // Act
      await service.updateResourceRelationCache(EXAMPLE_RESOURCE_ID);

      // Assert
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining(
          "Cannot update resource relation cache for resource"
        )
      );
    });
  });

  describe("getCascadingBuildableResourceIds", () => {
    it("should return cascading buildable resource ids", async () => {
      // Arrange
      const resourceIds = [EXAMPLE_RESOURCE_ID];
      const parentResourceId = "parentResourceId";

      // Mock the findMany to return different results on second call to simulate new resources found
      prismaResourceRelationCacheFindManyMock
        .mockReturnValueOnce([
          {
            parentResourceId,
            childResourceId: EXAMPLE_RESOURCE_ID,
            relationKey: EXAMPLE_RELATION_KEY,
            parentShouldBuildWithChild: true,
          },
        ])
        .mockReturnValueOnce([]);

      // Act
      const result = await service.getCascadingBuildableResourceIds(
        resourceIds
      );

      // Assert
      expect(result).toContain(EXAMPLE_RESOURCE_ID);
      expect(result).toContain(parentResourceId);
      expect(prismaResourceRelationCacheFindManyMock).toHaveBeenCalledTimes(2);
      expect(prismaResourceRelationCacheFindManyMock).toHaveBeenCalledWith({
        where: {
          parentShouldBuildWithChild: true,
          childResourceId: { in: resourceIds },
        },
      });
    });

    it("should handle errors during cascading resource id retrieval", async () => {
      // Arrange
      const resourceIds = [EXAMPLE_RESOURCE_ID];
      prismaResourceRelationCacheFindManyMock.mockImplementationOnce(() => {
        throw new Error("Database error");
      });

      const loggerErrorSpy = jest.spyOn(service["logger"], "error");

      // Act
      const result = await service.getCascadingBuildableResourceIds(
        resourceIds
      );

      // Assert
      expect(result).toEqual(resourceIds);
      expect(loggerErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to get buildable parents"),
        expect.any(Error)
      );
    });
  });
});
