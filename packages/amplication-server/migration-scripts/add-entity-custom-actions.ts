import { ConflictException, NotFoundException } from "@nestjs/common";
import * as CodeGenTypes from "@amplication/code-gen-types";
import {
  getDefaultActionsForEntity,
  getDefaultActionsForRelationField,
} from "@amplication/dsg-utils";
import { EntityField, EnumDataType } from "@amplication/code-gen-types";
import {
  EnumResourceType,
  PrismaClient,
} from "../prisma/generated-prisma-client";
import {
  Entity,
  EnumBlockType,
  Resource,
} from "../../amplication-code-gen-types/src/models";
import { CreateBlockArgs } from "../src/core/block/dto";
import { Block, IBlock } from "../src/models";
import { ModuleAction } from "../src/core/moduleAction/dto/ModuleAction";
import { Module } from "../src/core/module/dto/Module";

const CURRENT_VERSION_NUMBER = 0;
const ALLOW_NO_PARENT_ONLY = new Set([null]);
const DEFAULT_MODULE_DESCRIPTION =
  "This module was automatically created as the default module for an entity";
const prisma = new PrismaClient();

/** use NULL in the set of allowed parents to allow the block to be created without a parent */
const blockTypeAllowedParents: {
  [key in EnumBlockType]: Set<EnumBlockType | null>;
} = {
  [EnumBlockType.ServiceSettings]: ALLOW_NO_PARENT_ONLY,
  [EnumBlockType.ProjectConfigurationSettings]: ALLOW_NO_PARENT_ONLY,
  [EnumBlockType.Topic]: ALLOW_NO_PARENT_ONLY,
  [EnumBlockType.ServiceTopics]: ALLOW_NO_PARENT_ONLY,

  [EnumBlockType.PluginInstallation]: ALLOW_NO_PARENT_ONLY,
  [EnumBlockType.PluginOrder]: ALLOW_NO_PARENT_ONLY,
  [EnumBlockType.Module]: ALLOW_NO_PARENT_ONLY,
  [EnumBlockType.ModuleAction]: new Set([EnumBlockType.Module]),
};

export async function mainCreateEntitiesDefaultCustomActions() {
  const resources = await prisma.resource.findMany({
    where: {
      resourceType: EnumResourceType.Service,
      deletedAt: null,
      archived: { not: true },
    },
  });

  console.log("resources: ", resources.length);
  let index = 1;

  const chunks = chunkArrayInGroups(resources, 500);

  for (const chunk of chunks) {
    console.log("chunk number: ", index++);
    await migrateChunk(chunk);
  }

  async function migrateChunk(chunk: Resource[]) {
    try {
      const promises = chunk.map(async (resource) => {
        const entities = await prisma.entity.findMany({
          where: {
            resourceId: resource.id,
          },
        });

        entities.forEach(async (entity) => {
          const entityArgs = {
            data: {
              name: entity.name,
              displayName: entity.name,
              resource: {
                connect: {
                  id: entity.resourceId,
                },
              },
            },
          };

          const entityModule = await prisma.block.findFirst({
            where: {
              blockType: EnumBlockType.Module,
              resourceId: entity.resourceId,
            },
          });

          if (entityModule) return;

          const module = await createDefaultModuleForEntity(entityArgs, entity);

          const fields = (await prisma.entityField.findMany({
            where: {
              entityVersion: {
                entityId: entity.id,
                versionNumber: 0,
              },
            },
          })) as EntityField[];

          const relationFields = fields.filter(
            (e) => e.dataType === EnumDataType.Lookup
          );
          relationFields.forEach(async (field) => {
            await createDefaultActionsForRelationField(
              entity,
              field,
              module.id
            );
          });
        });
      });

      await Promise.all(promises);
    } catch (error) {
      console.log(`Failed to run migrateChunk, error: ${error}`);
    }
  }

  await prisma.$disconnect();
}

async function createDefaultActionsForRelationField(
  entity: Entity,
  field: EntityField,
  moduleId: string
): Promise<ModuleAction[]> {
  const defaultActions = await getDefaultActionsForRelationField(
    entity as unknown as CodeGenTypes.Entity,
    field as unknown as CodeGenTypes.EntityField
  );
  return await Promise.all(
    Object.keys(defaultActions).map((action) => {
      return (
        defaultActions[action] &&
        createModuleAction({
          data: {
            fieldPermanentId: field.permanentId,
            ...defaultActions[action],
            parentBlock: {
              connect: {
                id: moduleId,
              },
            },
            resource: {
              connect: {
                id: entity.resourceId,
              },
            },
          },
        })
      );
    })
  );
}

function chunkArrayInGroups(arr, size) {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

async function createDefaultModuleForEntity(
  args: any,
  entity: Entity
): Promise<Module> {
  const module = await createModule({
    ...args,
    data: {
      ...args.data,
      description: DEFAULT_MODULE_DESCRIPTION,
      entityId: entity.id,
    },
  });

  await createDefaultActionsForEntityModule(entity, module);

  return module;
}

async function createModule(args: any): Promise<Module> {
  return create<Module>({
    ...args,
    data: {
      ...args.data,
      blockType: EnumBlockType.Module,
      enabled: true,
    },
  });
}

async function createModuleAction(args: any): Promise<ModuleAction> {
  return create<ModuleAction>({
    ...args,
    data: {
      ...args.data,
      blockType: EnumBlockType.ModuleAction,
      enabled: true,
    },
  });
}

async function create<T extends IBlock>(
  args: CreateBlockArgs & {
    data: CreateBlockArgs["data"] & { blockType: keyof typeof EnumBlockType };
  }
): Promise<T> {
  const {
    displayName,
    description,
    resource: resourceConnect,
    blockType,
    parentBlock: parentBlockConnect,
    inputParameters,
    outputParameters,
    ...settings
  } = args.data;

  let parentBlock: Block | null = null;

  if (parentBlockConnect?.connect?.id) {
    // validate that the parent block is from the same resource, and that the link between the two types is allowed
    parentBlock = await resolveParentBlock(
      parentBlockConnect.connect.id,
      resourceConnect.connect.id
    );
  }

  // validate the parent block type
  if (
    !canUseParentType(
      EnumBlockType[blockType],
      parentBlock ? EnumBlockType[parentBlock.blockType] : null
    )
  ) {
    throw new ConflictException(
      parentBlock?.blockType
        ? `Block type ${parentBlock.blockType} is not allowed as a parent for block type ${blockType}`
        : `Block type ${blockType} cannot be created without a parent block`
    );
  }

  const blockData = {
    displayName: displayName,
    description: description,
    resource: resourceConnect,
    blockType: blockType,
    parentBlock: parentBlockConnect,
    lockedAt: new Date(),
  };

  const versionData = {
    displayName: displayName,
    description: description,
    versionNumber: CURRENT_VERSION_NUMBER,
    inputParameters: { params: inputParameters },
    outputParameters: {
      params: outputParameters,
    },
    settings,
  };

  // Create first entry on BlockVersion by default when new block is created
  const version = await prisma.blockVersion.create({
    data: {
      ...versionData,
      commit: undefined,
      block: {
        create: blockData,
      },
    },
    include: {
      block: {
        include: {
          resource: true,
          parentBlock: true,
        },
      },
    },
  });

  const block: IBlock = {
    displayName,
    description,
    resourceId: resourceConnect.connect.id,
    blockType: blockData.blockType,
    id: version.block.id,
    createdAt: version.block.createdAt,
    updatedAt: version.block.updatedAt,
    parentBlock: version.block.parentBlock || null,
    versionNumber: versionData.versionNumber,
    inputParameters: inputParameters,
    outputParameters: outputParameters,
  };

  return {
    ...block,
    ...settings,
  } as unknown as T;
}

async function resolveParentBlock(
  blockId: string,
  resourceId: string
): Promise<Block> {
  const matchingBlocks = await prisma.block.findMany({
    where: {
      id: blockId,
      resourceId,
    },
  });
  if (matchingBlocks.length === 0) {
    throw new NotFoundException(`Can't find parent block with ID ${blockId}`);
  }
  if (matchingBlocks.length === 1) {
    const [block] = matchingBlocks;

    return block;
  }
  throw new Error("Unexpected length of matchingBlocks");
}

function canUseParentType(
  blockType: EnumBlockType,
  parentType: EnumBlockType | null
): boolean {
  return blockTypeAllowedParents[blockType].has(parentType);
}

async function createDefaultActionsForEntityModule(
  entity: Entity,
  module: Module
): Promise<ModuleAction[]> {
  const defaultActions = await getDefaultActionsForEntity(
    entity as unknown as CodeGenTypes.Entity
  );
  return await Promise.all(
    Object.keys(defaultActions).map((action) => {
      return (
        defaultActions[action] &&
        createModuleAction({
          data: {
            ...defaultActions[action],
            parentBlock: {
              connect: {
                id: module.id,
              },
            },
            resource: {
              connect: {
                id: entity.resourceId,
              },
            },
          },
        })
      );
    })
  );
}

mainCreateEntitiesDefaultCustomActions().catch(console.error);

// Execute from bash
// $ POSTGRESQL_URL=postgres://[user]:[password]@127.0.0.1:5432/app-database npx ts-node -P  packages/amplication-server/tsconfig.app.json -r tsconfig-paths/register packages/amplication-server/src/add-entity-custom-actions.ts
