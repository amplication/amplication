import {
  Injectable,
  NotFoundException,
  ConflictException,
} from "@nestjs/common";
import type { JsonObject } from "type-fest";
import { pick, head, last } from "lodash";
import {
  Block as PrismaBlock,
  BlockVersion as PrismaBlockVersion,
  Prisma,
  PrismaService,
} from "../../prisma";
import { DiffService } from "../../services/diff.service";
import {
  Block,
  BlockVersion,
  IBlock,
  BlockInputOutput,
  User,
  Resource,
} from "../../models";
import {
  prepareDeletedItemName,
  revertDeletedItemName,
} from "../../util/softDelete";
import {
  CreateBlockArgs,
  UpdateBlockArgs,
  FindManyBlockArgs,
  FindManyBlockTypeArgs,
  CreateBlockVersionArgs,
  FindManyBlockVersionArgs,
  LockBlockArgs,
} from "./dto";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import {
  EnumPendingChangeOriginType,
  EnumPendingChangeAction,
  PendingChange,
} from "../resource/dto";
import { DeleteBlockArgs } from "./dto/DeleteBlockArgs";
import { JsonFilter } from "../../dto/JsonFilter";
import { mergeAllSettings } from "./block.util";

const CURRENT_VERSION_NUMBER = 0;
const ALLOW_NO_PARENT_ONLY = new Set([null]);
const NON_COMPARABLE_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "versionNumber",
  "commitId",
];

export type BlockPendingChange = {
  /** The id of the changed block */
  originId: string;
  /** The type of change */
  action: EnumPendingChangeAction;
  originType: EnumPendingChangeOriginType.Block;
  /** The block version number */
  versionNumber: number;
  /** The block */
  origin: Block;

  resource: Resource;
};

@Injectable()
export class BlockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly diffService: DiffService
  ) {}

  /** use NULL in the set of allowed parents to allow the block to be created without a parent */
  blockTypeAllowedParents: {
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

  private async resolveParentBlock(
    blockId: string,
    resourceId: string
  ): Promise<Block> {
    const matchingBlocks = await this.prisma.block.findMany({
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

  async block(args: FindOneArgs): Promise<Block | null> {
    const block = await this.prisma.block.findFirst({
      where: {
        id: args.where.id,
        deletedAt: null,
      },
    });

    if (!block) {
      throw new Error(`Cannot find block with ID ${args.where.id}`);
    }

    return block;
  }
  /**
   * Creates a block of specific type
   */
  async create<T extends IBlock>(
    args: CreateBlockArgs & {
      data: CreateBlockArgs["data"] & { blockType: keyof typeof EnumBlockType };
    },
    userId: string
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
      parentBlock = await this.resolveParentBlock(
        parentBlockConnect.connect.id,
        resourceConnect.connect.id
      );
    }

    // validate the parent block type
    if (
      !this.canUseParentType(
        EnumBlockType[blockType],
        parentBlock && EnumBlockType[parentBlock.blockType]
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
      lockedByUser: {
        connect: {
          id: userId,
        },
      },
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
    const version = await this.prisma.blockVersion.create({
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
      parentBlockId: version.block.parentBlock?.id || null,
      versionNumber: versionData.versionNumber,
      inputParameters: inputParameters,
      outputParameters: outputParameters,
    };

    return {
      ...block,
      ...settings,
    } as unknown as T;
  }

  private versionToIBlock<T>(
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
      parentBlockId,
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
      parentBlockId,
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

  async findOne<T extends IBlock>(args: FindOneArgs): Promise<T | null> {
    const version = await this.prisma.blockVersion.findFirst({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        blockId: args.where.id,
        versionNumber: CURRENT_VERSION_NUMBER,
        block: {
          deletedAt: null,
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
        `Block with ID ${args.where.id} was not found`
      );
    }
    /**  @todo: add exception handling layer on the resolver level to convert to ApolloError */

    return this.versionToIBlock<T>(version);
  }

  /**@todo: convert versionToIBlock */
  /**@todo: return latest version number */
  async findMany(args: FindManyBlockArgs): Promise<Block[]> {
    return this.prisma.block.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  }

  async findManyByBlockTypeAndSettings<T extends IBlock>(
    args: FindManyBlockTypeArgs,
    blockType: EnumBlockType,
    settingsFilter?: JsonFilter
  ): Promise<T[]> {
    const blocks = this.prisma.block.findMany({
      ...args,
      where: {
        ...args.where,
        blockType: { equals: blockType },
        deletedAt: null,
        versions: {
          some: {
            versionNumber: CURRENT_VERSION_NUMBER,
            settings: settingsFilter,
          },
        },
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
      return this.versionToIBlock({ ...version, block });
    });
  }

  /**@todo: return latest version number */
  /**@todo: allow sorting by version number */

  async findManyByBlockType<T extends IBlock>(
    args: FindManyBlockTypeArgs,
    blockType: EnumBlockType
  ): Promise<T[]> {
    const blocks = this.prisma.block.findMany({
      ...args,
      where: {
        ...args.where,
        blockType: { equals: blockType },
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
      return this.versionToIBlock({ ...version, block });
    });
  }

  async createVersion(args: CreateBlockVersionArgs): Promise<BlockVersion> {
    const blockId = args.data.block.connect.id;
    const versions = await this.prisma.blockVersion.findMany({
      where: {
        block: { id: blockId },
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc,
      },
    });
    const currentVersion = head(versions); // Version 0
    const lastVersion = last(versions);
    if (!currentVersion) {
      throw new Error(`Block ${blockId} has no current version`);
    }
    if (!lastVersion) {
      throw new Error(`Block ${blockId} has no last version`);
    }
    const lastVersionNumber = lastVersion.versionNumber;

    const nextVersionNumber = lastVersionNumber + 1;

    return this.prisma.blockVersion.create({
      data: {
        displayName: currentVersion.displayName,
        description: currentVersion.description,
        inputParameters: currentVersion.inputParameters,
        outputParameters: currentVersion.outputParameters,
        settings: currentVersion.settings,
        commit: {
          connect: {
            id: args.data.commit.connect.id,
          },
        },
        versionNumber: nextVersionNumber,
        block: {
          connect: {
            id: blockId,
          },
        },
      },
    });
  }

  async getVersions(args: FindManyBlockVersionArgs): Promise<BlockVersion[]> {
    return this.prisma.blockVersion.findMany(args);
  }

  private canUseParentType(
    blockType: EnumBlockType,
    parentType: EnumBlockType | null
  ): boolean {
    return this.blockTypeAllowedParents[blockType].has(parentType);
  }

  public async getParentBlock(block: {
    parentBlockId?: string;
    parentBlock?: Block;
  }): Promise<Block | null> {
    if (block.parentBlock) {
      return block.parentBlock;
    }

    if (!block.parentBlockId) {
      return null;
    }

    return this.prisma.block.findUnique({
      where: {
        id: block.parentBlockId,
      },
    });
  }

  /**
   * Updates a block
   * Updates the name and description on the block, and the settings field on the current version
   * This method does not update the input or output parameters
   * This method does not support partial updates
   * */
  async update<T extends IBlock>(
    args: UpdateBlockArgs,
    user: User,
    keysToNotMerge?: string[]
  ): Promise<T> {
    const { displayName, description, ...settings } = args.data;

    const existingVersion = await this.prisma.blockVersion.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        blockId_versionNumber: {
          blockId: args.where.id,
          versionNumber: CURRENT_VERSION_NUMBER,
        },
      },
    });

    // merge the existing settings with the new settings. use deep merge but do not merge arrays
    const allSettings = mergeAllSettings(
      existingVersion.settings,
      settings,
      keysToNotMerge || []
    );

    return await this.useLocking(args.where.id, user, async () => {
      const version = await this.prisma.blockVersion.update({
        data: {
          settings: allSettings,
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

      return this.versionToIBlock<T>(version);
    });
  }

  async delete<T extends IBlock>(
    args: DeleteBlockArgs,
    user: User,
    deleteChildBlocks = false,
    deleteChildBlocksRecursive = true
  ): Promise<T | null> {
    const blockVersion = await this.prisma.blockVersion.findUnique({
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

    if (blockVersion.block.deletedAt !== null) {
      throw new Error(`Block ${args.where.id} is already deleted`);
    }

    if (!blockVersion) {
      throw new Error(`Block ${args.where.id} is not exist`);
    }

    await this.useLocking(args.where.id, user, async (block) => {
      return this.prisma.block.update({
        where: args.where,
        data: {
          displayName: prepareDeletedItemName(block.displayName, block.id),
          deletedAt: new Date(),
          versions: {
            update: {
              where: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                blockId_versionNumber: {
                  blockId: args.where.id,
                  versionNumber: CURRENT_VERSION_NUMBER,
                },
              },
              data: {
                deleted: true,
              },
            },
          },
        },
      });
    });

    if (deleteChildBlocks) {
      const childBlocks = await this.findMany({
        where: {
          parentBlock: {
            id: args.where.id,
          },
        },
      });

      await Promise.all(
        childBlocks.map((childBlock) =>
          this.delete(
            {
              where: {
                id: childBlock.id,
              },
            },
            user,
            deleteChildBlocksRecursive, // if recursive is true, delete the child blocks of the child block
            deleteChildBlocksRecursive
          )
        )
      );
    }

    return this.versionToIBlock<T>(blockVersion);
  }

  // Tries to acquire a lock on the given block for the given user.
  // The function checks that the given block is not already locked by another user
  // If the current user already has a lock on the block, the function complete successfully
  // The function also check that the given block was not "deleted".
  async acquireLock(args: LockBlockArgs, user: User): Promise<Block | null> {
    const blockId = args.where.id;

    const block = await this.block({
      where: {
        id: blockId,
      },
    });

    if (block.lockedByUserId === user.id) {
      return block;
    }

    if (block.lockedByUserId) {
      throw new Error(
        `Block ${blockId} is already locked by another user - ${block.lockedByUserId} `
      );
    }

    return this.prisma.block.update({
      where: {
        id: blockId,
      },
      data: {
        lockedByUser: {
          connect: {
            id: user.id,
          },
        },
        lockedAt: new Date(),
      },
    });
  }

  async releaseLock(blockId: string): Promise<Block | null> {
    return this.prisma.block.update({
      where: {
        id: blockId,
      },
      data: {
        lockedByUser: {
          disconnect: true,
        },
        lockedAt: null,
      },
    });
  }

  /**
   * Has the responsibility to unlock or keep a block locked based on whether
   * it has changes. It's supposed to be used after an operation that uses locking
   * was made.
   * @param blockId A locked block
   */
  async updateLock(blockId: string): Promise<void> {
    const hasPendingChanges = await this.hasPendingChanges(blockId);

    if (!hasPendingChanges) {
      await this.releaseLock(blockId);
    }
  }

  /**
   * Higher order function responsible for encapsulating the locking behavior.
   * It will lock a block, execute some provided operations on it then update
   * the lock (unlock it or keep it locked).
   * @param blockId The block on which the locking and operations are performed
   * @param user The user requesting the operations
   * @param fn A function containing the operations on the block
   * @returns What the provided function `fn` returns
   */
  async useLocking<T>(
    blockId: string,
    user: User,
    fn: (block: Block) => T
  ): Promise<T> {
    const block = await this.acquireLock({ where: { id: blockId } }, user);

    try {
      return await fn(block);
    } finally {
      await this.updateLock(blockId);
    }
  }

  /**
   * Checks if the block has any meaningful changes (some generated properties are ignored : id, createdAt...)
   * between its current and last version.
   * @param blockId The block to check for changes
   * @returns whether the block's current version has changes
   */
  async hasPendingChanges(blockId: string): Promise<boolean> {
    const blockVersions = await this.prisma.blockVersion.findMany({
      where: {
        blockId,
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc,
      },
    });

    // If there's only one version, lastVersion will be undefined
    const currentVersion = blockVersions.shift();
    const lastVersion = last(blockVersions);

    if (currentVersion.deleted && !lastVersion) {
      // The block was created than deleted => there are no changes
      return false;
    }

    return this.diffService.areDifferent(
      currentVersion,
      lastVersion,
      NON_COMPARABLE_PROPERTIES
    );
  }

  /**
   * Gets all the blocks changed since the last resource commit
   * @param projectId the resource ID to find changes to
   * @param userId the user ID the resource ID relates to
   */
  async getChangedBlocks(
    projectId: string,
    userId: string
  ): Promise<BlockPendingChange[]> {
    const changedBlocks = await this.prisma.block.findMany({
      where: {
        lockedByUserId: userId,
        resource: {
          deletedAt: null,
          project: {
            id: projectId,
          },
        },
      },
      include: {
        lockedByUser: true,
        resource: true,
        versions: {
          orderBy: {
            versionNumber: Prisma.SortOrder.desc,
          },
          /**find the first two versions to decide whether it is an update or a create */
          take: 2,
        },
      },
    });

    return changedBlocks.map((block) => {
      const [lastVersion] = block.versions;
      const action = block.deletedAt
        ? EnumPendingChangeAction.Delete
        : block.versions.length > 1
        ? EnumPendingChangeAction.Update
        : EnumPendingChangeAction.Create;

      block.versions =
        undefined; /**remove the versions data - it will only be returned if explicitly asked by gql */

      //prepare name fields for display
      if (action === EnumPendingChangeAction.Delete) {
        block.displayName = revertDeletedItemName(block.displayName, block.id);
      }

      return {
        originId: block.id,
        action: action,
        originType: EnumPendingChangeOriginType.Block,
        versionNumber: lastVersion.versionNumber + 1,
        origin: block,
        resource: block.resource,
      };
    });
  }

  /**
   * @todo REMOVE this after we finish with the custom actions blocks migration
   *
   * Gets Blocks of types Module and ModuleAction (ONLY) changed since the last resource commit
   * @param projectId the resource ID to find changes to
   * @param userId the user ID the resource ID relates to
   */
  async getChangedBlocksForCustomActionsMigration(
    projectId: string,
    userId: string
  ): Promise<BlockPendingChange[]> {
    const changedBlocks = await this.prisma.block.findMany({
      where: {
        lockedByUserId: userId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR: [
          { blockType: EnumBlockType.Module },
          { blockType: EnumBlockType.ModuleAction },
        ],
        resource: {
          deletedAt: null,
          project: {
            id: projectId,
          },
        },
      },
      include: {
        lockedByUser: true,
        resource: true,
        versions: {
          orderBy: {
            versionNumber: Prisma.SortOrder.desc,
          },
          /**find the first two versions to decide whether it is an update or a create */
          take: 2,
        },
      },
    });

    return changedBlocks.map((block) => {
      const [lastVersion] = block.versions;
      const action = block.deletedAt
        ? EnumPendingChangeAction.Delete
        : block.versions.length > 1
        ? EnumPendingChangeAction.Update
        : EnumPendingChangeAction.Create;

      block.versions =
        undefined; /**remove the versions data - it will only be returned if explicitly asked by gql */

      //prepare name fields for display
      if (action === EnumPendingChangeAction.Delete) {
        block.displayName = revertDeletedItemName(block.displayName, block.id);
      }

      return {
        originId: block.id,
        action: action,
        originType: EnumPendingChangeOriginType.Block,
        versionNumber: lastVersion.versionNumber + 1,
        origin: block,
        resource: block.resource,
      };
    });
  }

  async getChangedBlocksByCommit(commitId: string): Promise<PendingChange[]> {
    const changedBlocks = await this.prisma.block.findMany({
      where: {
        versions: {
          some: {
            commitId: commitId,
          },
        },
      },
      include: {
        lockedByUser: true,
        resource: true,
        versions: {
          where: {
            commitId: commitId,
          },
        },
      },
    });

    return changedBlocks.map((block) => {
      const [changedVersion] = block.versions;
      const action = changedVersion.deleted
        ? EnumPendingChangeAction.Delete
        : changedVersion.versionNumber > 1
        ? EnumPendingChangeAction.Update
        : EnumPendingChangeAction.Create;

      //prepare name fields for display
      block.displayName = changedVersion.displayName;

      return {
        originId: block.id,
        action: action,
        originType: EnumPendingChangeOriginType.Block,
        versionNumber: changedVersion.versionNumber,
        origin: block,
        resource: block.resource,
      };
    });
  }

  async discardPendingChanges(
    block: BlockPendingChange,
    user: User
  ): Promise<Block> {
    const { originId, action } = block;
    const blockVersions = await this.prisma.blockVersion.findMany({
      where: {
        block: { id: originId },
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc,
      },
      include: {
        block: true,
      },
    });

    const firstBlockVersion = head(blockVersions);
    const lastBlockVersion = last(blockVersions);

    if (!firstBlockVersion || !lastBlockVersion) {
      throw new Error(`Block ${originId} has no versions `);
    }

    if (firstBlockVersion.block.lockedByUserId !== user.id) {
      throw new Error(
        `Cannot discard pending changes on block ${originId} since it is not currently locked by the requesting user `
      );
    }

    if (action === EnumPendingChangeAction.Create) {
      await this.delete({ where: { id: originId } }, user);
    }

    await this.cloneVersionData(lastBlockVersion.id, firstBlockVersion.id);

    return this.releaseLock(originId);
  }
  private async cloneVersionData(
    sourceVersionId: string,
    targetVersionId: string
  ): Promise<void> {
    const sourceVersion = await this.prisma.blockVersion.findUnique({
      where: {
        id: sourceVersionId,
      },
    });

    if (!sourceVersion) {
      throw new Error(`Can't find source (Block Version ${sourceVersionId})`);
    }

    let targetVersion = await this.prisma.blockVersion.findUnique({
      where: {
        id: targetVersionId,
      },
    });

    if (!targetVersion) {
      throw new Error(`Can't find target (Block Version ${targetVersionId})`);
    }

    const names = pick(sourceVersion, ["displayName", "description"]);

    //update the target version with its fields, and the its parent block
    targetVersion = await this.prisma.blockVersion.update({
      where: {
        id: targetVersionId,
      },
      data: {
        //when the source target is flagged as deleted (commit on DELETE action), do not update the parent block
        block: sourceVersion.deleted
          ? undefined
          : {
              update: {
                ...names,
                deletedAt: null,
              },
            },
        ...names,
        settings: sourceVersion.settings,
        inputParameters: sourceVersion.inputParameters,
        outputParameters: sourceVersion.outputParameters,
      },
    });
  }
}
