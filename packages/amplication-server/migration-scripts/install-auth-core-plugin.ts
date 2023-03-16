import {
  PrismaClient,
  EnumResourceType,
  Block as PrismaBlock,
  BlockVersion as PrismaBlockVersion,
} from "../src/prisma";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { BlockInputOutput } from "../../amplication-code-gen-types/src/models";
import { JsonObject } from "type-fest";
import { IBlock, Block, Resource } from "../src/models";
import { CreateBlockArgs, UpdateBlockArgs } from "../src/core/block/dto";
import { EnumBlockType } from "../src/enums/EnumBlockType";
import { PluginOrder } from "../src/core/pluginInstallation/dto/PluginOrder";
import { PluginOrderItem } from "../src/core/pluginInstallation/dto/PluginOrderItem";
import { PluginInstallation } from "../src/core/pluginInstallation/dto/PluginInstallation";
import { ServiceSettings } from "../src/core/serviceSettings/dto";
import { EnumAuthProviderType } from "../src/core/serviceSettings/dto/EnumAuthenticationProviderType";

const CURRENT_VERSION_NUMBER = 0;
const client = new PrismaClient();
const ALLOW_NO_PARENT_ONLY = new Set([null]);

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
};

const sortPluginsArr = (pluginArr: PluginOrderItem[]) =>
  pluginArr.sort((a, b) => (a.order > b.order ? 1 : -1));

const reOrderPlugins = (
  argsData: PluginOrderItem,
  pluginArr: PluginOrderItem[]
) => {
  const currId = argsData.pluginId;
  const currOrder = argsData.order;
  let orderIndex = 1;
  const sortHelperMap = { [currOrder]: currId };
  const newOrderArr = [{ pluginId: currId, order: currOrder }];

  pluginArr.reduce(
    (orderedObj: { [key: string]: string }, plugin: PluginOrderItem) => {
      if (currId === plugin.pluginId) return orderedObj;

      orderIndex = orderedObj.hasOwnProperty(orderIndex)
        ? orderIndex + 1
        : orderIndex;

      orderedObj[orderIndex] = plugin.pluginId;
      newOrderArr.push({ pluginId: plugin.pluginId, order: orderIndex });
      orderIndex++;

      return orderedObj;
    },
    sortHelperMap
  );

  return newOrderArr;
};

async function main() {
  const resources = await client.resource.findMany({
    where: {
      resourceType: EnumResourceType.Service,
      deletedAt: null,
      archived: { not: true },
    },
  });

  console.log(resources.length);
  let index = 1;

  const chunks = chunkArrayInGroups(resources, 500);

  for (const chunk of chunks) {
    console.log(index++);
    await migrateChunk(chunk);
  }

  function isPluginExist(
    plugins: PluginInstallation[],
    authProvider: string
  ): boolean {
    return plugins.some((plugin) => plugin.pluginId.trim() == authProvider);
  }

  function isAuthStrategyPluginExist(
    plugins: PluginInstallation[],
    authPluginNames: string[]
  ): boolean {
    const results = plugins.filter((plugin) => {
      return (
        plugin.pluginId ===
        authPluginNames.find((name) => name === plugin.pluginId)
      );
    });

    if (results.length > 0) return true;
    return false;
  }
  async function migrateChunk(chunk: Resource[]) {
    try {
      const promises = chunk.map(async (resource) => {
        const resourceInstallations =
          await findManyByBlockType<PluginInstallation>(
            resource.id,
            EnumBlockType.PluginInstallation
          );

        const isAuthPluginExist = isPluginExist(
          resourceInstallations,
          "auth-core"
        );

        const isAuthStrategyPluginInstalled = isAuthStrategyPluginExist(
          resourceInstallations,
          ["auth-basic", "auth-jwt"]
        );

        if (isAuthPluginExist && isAuthStrategyPluginInstalled) return;

        if (!isAuthPluginExist) {
          const newPlugin = await createPluginInstallation({
            data: {
              displayName: "Auth-core",
              enabled: true,
              npm: "@amplication/plugin-auth-core",
              pluginId: "auth-core",
              settings: {},
              version: "latest",
              resource: {
                connect: {
                  id: resource.id,
                },
              },
            },
          });

          await setOrder(newPlugin.id);
        }

        if (!isAuthStrategyPluginInstalled) {
          const [serviceSettings] = await findManyByBlockType<ServiceSettings>(
            resource.id,
            EnumBlockType.ServiceSettings
          );

          const pluginName =
            serviceSettings.authProvider === EnumAuthProviderType.Http
              ? "basic"
              : "jwt";

          const AuthStrategyPlugin = await createPluginInstallation({
            data: {
              displayName: `Auth-${pluginName}`,
              enabled: true,
              npm: `@amplication/plugin-auth-${pluginName}`,
              pluginId: `auth-${pluginName}`,
              settings: {},
              version: "latest",
              resource: {
                connect: {
                  id: resource.id,
                },
              },
            },
          });

          await setOrder(AuthStrategyPlugin.id);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.log(`Failed to run migrateChunk, error: ${error}`);
    }
  }

  await client.$disconnect();
}

function chunkArrayInGroups(arr, size) {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
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
  const version = await client.blockVersion.create({
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

async function createPluginInstallation(
  args: any
): Promise<PluginInstallation> {
  return create<PluginInstallation>({
    ...args,
    data: {
      ...args.data,
      blockType: EnumBlockType.PluginInstallation,
    },
  });
}

function versionToIBlock<T>(
  version: PrismaBlockVersion & {
    block: PrismaBlock & { parentBlock: PrismaBlock };
    settings: unknown;
  }
): T {
  const {
    id,
    createdAt,
    updatedAt,
    parentBlock,
    displayName,
    description,
    blockType,
    lockedAt,
    lockedByUserId,
    resourceId,
  } = version.block;

  const block: IBlock = {
    id,
    createdAt,
    updatedAt,
    parentBlock,
    displayName,
    description,
    blockType,
    resourceId,
    lockedAt,
    lockedByUserId,
    versionNumber: version.versionNumber,
    inputParameters: (
      version.inputParameters as unknown as {
        params: BlockInputOutput[];
      }
    ).params,
    outputParameters: (
      version.outputParameters as unknown as {
        params: BlockInputOutput[];
      }
    ).params,
  };
  const settings = version.settings as JsonObject;
  return {
    ...block,
    ...settings,
  } as unknown as T;
}

async function findManyByBlockType<T extends IBlock>(
  resourceId: string,
  blockType: EnumBlockType
): Promise<T[]> {
  const blocks = client.block.findMany({
    where: {
      resourceId: resourceId,
      blockType: blockType,
      deletedAt: null,
    },
    include: {
      versions: {
        where: {
          versionNumber: CURRENT_VERSION_NUMBER,
        },
      },
      parentBlock: true,
    },
  });
  return (await blocks).map((block) => {
    const [version] = block.versions;
    return versionToIBlock({ ...version, block });
  });
}

async function findOne(
  pluginInstallationId: string
): Promise<PluginInstallation> {
  const version = await client.blockVersion.findUnique({
    where: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      blockId_versionNumber: {
        blockId: pluginInstallationId,
        versionNumber: CURRENT_VERSION_NUMBER,
      },
    },
    include: {
      block: {
        include: {
          parentBlock: true,
        },
      },
    },
  });

  if (!version) {
    throw new NotFoundException(
      `Block with ID ${pluginInstallationId} was not found`
    );
  }
  /**  @todo: add exception handling layer on the resolver level to convert to ApolloError */

  return versionToIBlock(version);
}

async function setOrder(pluginInstallationId: string): Promise<PluginOrder> {
  const installation = await findOne(pluginInstallationId);

  const [currentOrder] = await findManyByBlockType<PluginOrder>(
    installation.resourceId,
    EnumBlockType.PluginOrder
  );

  if (!currentOrder) {
    return await create<PluginOrder>({
      data: {
        blockType: EnumBlockType.PluginOrder,
        displayName: "Plugin Order",
        order: [
          {
            pluginId: installation.pluginId,
            order: 1,
          },
        ],
        resource: {
          connect: {
            id: installation.resourceId,
          },
        },
      },
    });
  }

  const orderedPluginArr = sortPluginsArr(currentOrder.order);
  const newOrderedPlugins = reOrderPlugins(
    {
      pluginId: installation.pluginId,
      order: currentOrder.order.length + 1,
    },
    orderedPluginArr
  );

  return updatePlugInOder({
    data: {
      order: sortPluginsArr(newOrderedPlugins),
    },
    where: {
      id: currentOrder.id,
    },
  });
}

async function resolveParentBlock(
  blockId: string,
  resourceId: string
): Promise<Block> {
  const matchingBlocks = await client.block.findMany({
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

async function updatePlugInOder(args: any): Promise<PluginOrder> {
  return update<PluginOrder>({
    ...args,
  });
}

async function update<T extends IBlock>(args: UpdateBlockArgs): Promise<T> {
  const { displayName, description, ...settings } = args.data;

  const version = await client.blockVersion.update({
    data: {
      settings: settings,
      block: {
        update: {
          displayName,
          description,
        },
      },
      displayName,
      description,
    },
    where: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      blockId_versionNumber: {
        blockId: args.where.id,
        versionNumber: CURRENT_VERSION_NUMBER,
      },
    },
    include: {
      block: {
        include: {
          parentBlock: true,
        },
      },
    },
  });

  return versionToIBlock<T>(version);
}

function canUseParentType(
  blockType: EnumBlockType,
  parentType: EnumBlockType | null
): boolean {
  return blockTypeAllowedParents[blockType].has(parentType);
}

main().catch(console.error);

// Execute from bash
// $ POSTGRESQL_URL=postgres://[user]:[password]@127.0.0.1:5432/app-database npx ts-node install-auth-core-plugin.ts
