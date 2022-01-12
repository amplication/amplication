import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { JsonObject } from 'type-fest';
import head from 'lodash.head';
import last from 'lodash.last';
import { pick } from 'lodash';
import {
  Block as PrismaBlock,
  BlockVersion as PrismaBlockVersion,
  Prisma
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { DiffService } from 'src/services/diff.service';
import {
  Block,
  BlockVersion,
  IBlock,
  BlockInputOutput,
  User
} from 'src/models';
import { revertDeletedItemName } from 'src/util/softDelete';
import {
  CreateBlockArgs,
  UpdateBlockArgs,
  FindManyBlockArgs,
  FindManyBlockTypeArgs,
  CreateBlockVersionArgs,
  FindManyBlockVersionArgs,
  LockBlockArgs
} from './dto';
import { FindOneArgs } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import {
  EnumPendingChangeResourceType,
  EnumPendingChangeAction,
  PendingChange
} from '../app/dto';

const CURRENT_VERSION_NUMBER = 0;
const ALLOW_NO_PARENT_ONLY = new Set([null]);
const NON_COMPARABLE_PROPERTIES = [
  'id',
  'createdAt',
  'updatedAt',
  'versionNumber',
  'commitId'
];

export type BlockPendingChange = {
  /** The id of the changed block */
  resourceId: string;
  /** The type of change */
  action: EnumPendingChangeAction;
  resourceType: EnumPendingChangeResourceType.Block;
  /** The block version number */
  versionNumber: number;
  /** The block */
  resource: Block;
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
    [EnumBlockType.ConnectorRestApiCall]: new Set([
      EnumBlockType.ConnectorRestApi
    ]),
    [EnumBlockType.ConnectorRestApi]: new Set([EnumBlockType.Flow, null]),
    [EnumBlockType.AppSettings]: ALLOW_NO_PARENT_ONLY,
    [EnumBlockType.Flow]: ALLOW_NO_PARENT_ONLY,
    [EnumBlockType.ConnectorSoapApi]: ALLOW_NO_PARENT_ONLY,
    [EnumBlockType.ConnectorFile]: ALLOW_NO_PARENT_ONLY,
    [EnumBlockType.EntityApi]: ALLOW_NO_PARENT_ONLY,
    [EnumBlockType.EntityApiEndpoint]: ALLOW_NO_PARENT_ONLY,
    [EnumBlockType.FlowApi]: ALLOW_NO_PARENT_ONLY,
    [EnumBlockType.Layout]: ALLOW_NO_PARENT_ONLY,
    [EnumBlockType.CanvasPage]: ALLOW_NO_PARENT_ONLY,
    [EnumBlockType.EntityPage]: ALLOW_NO_PARENT_ONLY,
    [EnumBlockType.Document]: ALLOW_NO_PARENT_ONLY
  };

  private async resolveParentBlock(
    blockId: string,
    appId: string
  ): Promise<Block> {
    const matchingBlocks = await this.prisma.block.findMany({
      where: {
        id: blockId,
        appId
      }
    });
    if (matchingBlocks.length === 0) {
      throw new NotFoundException(`Can't find parent block with ID ${blockId}`);
    }
    if (matchingBlocks.length === 1) {
      const [block] = matchingBlocks;
      return block;
    }
    throw new Error('Unexpected length of matchingBlocks');
  }

  async block(args: FindOneArgs): Promise<Block | null> {
    const block = await this.prisma.block.findFirst({
      where: {
        id: args.where.id
        //deletedAt: null
      }
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
      data: CreateBlockArgs['data'] & { blockType: keyof typeof EnumBlockType };
    },
    user: User
  ): Promise<T> {
    const {
      displayName,
      description,
      app: appConnect,
      blockType,
      parentBlock: parentBlockConnect,
      inputParameters,
      outputParameters,
      ...settings
    } = args.data;

    let parentBlock: Block | null = null;

    if (parentBlockConnect?.connect?.id) {
      // validate that the parent block is from the same app, and that the link between the two types is allowed
      parentBlock = await this.resolveParentBlock(
        parentBlockConnect.connect.id,
        appConnect.connect.id
      );
    }

    // validate the parent block type
    if (
      parentBlock &&
      !this.canUseParentType(
        EnumBlockType[blockType],
        EnumBlockType[parentBlock.blockType]
      )
    ) {
      throw new ConflictException(
        parentBlock.blockType
          ? `Block type ${parentBlock.blockType} is not allowed as a parent for block type ${blockType}`
          : `Block type ${blockType} cannot be created without a parent block`
      );
    }

    const blockData = {
      displayName: displayName,
      description: description,
      app: appConnect,
      blockType: blockType,
      parentBlock: parentBlockConnect,
      lockedAt: new Date(),
      lockedByUser: {
        connect: {
          id: user.id
        }
      }
    };

    const versionData = {
      displayName: displayName,
      description: description,
      versionNumber: CURRENT_VERSION_NUMBER,
      inputParameters: { params: inputParameters },
      outputParameters: {
        params: outputParameters
      },
      settings
    };

    // Create first entry on BlockVersion by default when new block is created
    const version = await this.prisma.blockVersion.create({
      data: {
        ...versionData,
        commit: undefined,
        block: {
          create: blockData
        }
      },
      include: {
        block: {
          include: {
            app: true,
            parentBlock: true
          }
        }
      }
    });

    const block: IBlock = {
      displayName,
      description,
      blockType: blockData.blockType,
      id: version.block.id,
      createdAt: version.block.createdAt,
      updatedAt: version.block.updatedAt,
      parentBlock: version.block.parentBlock || null,
      versionNumber: versionData.versionNumber,
      inputParameters: inputParameters,
      outputParameters: outputParameters
    };

    return ({
      ...block,
      ...settings
    } as unknown) as T;
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
      lockedByUserId
    } = version.block;
    const block: IBlock = {
      id,
      createdAt,
      updatedAt,
      parentBlock,
      displayName,
      description,
      blockType,
      lockedAt,
      lockedByUserId,
      versionNumber: version.versionNumber,
      inputParameters: ((version.inputParameters as unknown) as {
        params: BlockInputOutput[];
      }).params,
      outputParameters: ((version.outputParameters as unknown) as {
        params: BlockInputOutput[];
      }).params
    };
    const settings = version.settings as JsonObject;
    return ({
      ...block,
      ...settings
    } as unknown) as T;
  }

  async findOne<T extends IBlock>(args: FindOneArgs): Promise<T | null> {
    const version = await this.prisma.blockVersion.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        blockId_versionNumber: {
          blockId: args.where.id,
          versionNumber: CURRENT_VERSION_NUMBER
        }
      },
      include: {
        block: {
          include: {
            parentBlock: true
          }
        }
      }
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
    return this.prisma.block.findMany(args);
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
        blockType: { equals: blockType }
      },
      include: {
        versions: {
          where: {
            versionNumber: CURRENT_VERSION_NUMBER
          }
        },
        parentBlock: true
      }
    });
    return (await blocks).map(block => {
      const [version] = block.versions;
      return this.versionToIBlock({ ...version, block });
    });
  }

  async createVersion(args: CreateBlockVersionArgs): Promise<BlockVersion> {
    const blockId = args.data.block.connect.id;
    const versions = await this.prisma.blockVersion.findMany({
      where: {
        block: { id: blockId }
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc
      }
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
            id: args.data.commit.connect.id
          }
        },
        versionNumber: nextVersionNumber,
        block: {
          connect: {
            id: blockId
          }
        }
      }
    });
  }

  async getVersions(args: FindManyBlockVersionArgs): Promise<BlockVersion[]> {
    return this.prisma.blockVersion.findMany(args);
  }

  private canUseParentType(
    blockType: EnumBlockType,
    parentType: EnumBlockType
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
        id: block.parentBlockId
      }
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
    user: User
  ): Promise<T> {
    const { displayName, description, ...settings } = args.data;

    return await this.useLocking(args.where.id, user, async () => {
      const version = await this.prisma.blockVersion.update({
        data: {
          settings: settings,
          block: {
            update: {
              displayName,
              description
            }
          },
          displayName,
          description
        },
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          blockId_versionNumber: {
            blockId: args.where.id,
            versionNumber: CURRENT_VERSION_NUMBER
          }
        },
        include: {
          block: {
            include: {
              parentBlock: true
            }
          }
        }
      });

      return this.versionToIBlock<T>(version);
    });
  }

  // Tries to acquire a lock on the given block for the given user.
  // The function checks that the given block is not already locked by another user
  // If the current user already has a lock on the block, the function complete successfully
  // The function also check that the given block was not "deleted".
  async acquireLock(args: LockBlockArgs, user: User): Promise<Block | null> {
    const blockId = args.where.id;

    const block = await this.block({
      where: {
        id: blockId
      }
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
        id: blockId
      },
      data: {
        lockedByUser: {
          connect: {
            id: user.id
          }
        },
        lockedAt: new Date()
      }
    });
  }

  async releaseLock(blockId: string): Promise<Block | null> {
    return this.prisma.block.update({
      where: {
        id: blockId
      },
      data: {
        lockedByUser: {
          disconnect: true
        },
        lockedAt: null
      }
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
   * Higher order function responsible for encapsulating the locking behaviour.
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
        blockId
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc
      }
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
   * Gets all the blocks changed since the last app commit
   * @param appId the app ID to find changes to
   * @param userId the user ID the app ID relates to
   */
  async getChangedBlocks(
    appId: string,
    userId: string
  ): Promise<BlockPendingChange[]> {
    const changedBlocks = await this.prisma.block.findMany({
      where: {
        lockedByUserId: userId,
        appId
      },
      include: {
        lockedByUser: true,
        versions: {
          orderBy: {
            versionNumber: Prisma.SortOrder.desc
          },
          /**find the first two versions to decide whether it is an update or a create */
          take: 2
        }
      }
    });

    return changedBlocks.map(block => {
      const [lastVersion] = block.versions;
      const action = block.deletedAt
        ? EnumPendingChangeAction.Delete
        : block.versions.length > 1
        ? EnumPendingChangeAction.Update
        : EnumPendingChangeAction.Create;

      block.versions = undefined; /**remove the versions data - it will only be returned if explicitly asked by gql */

      //prepare name fields for display
      if (action === EnumPendingChangeAction.Delete) {
        block.displayName = revertDeletedItemName(block.displayName, block.id);
      }

      return {
        resourceId: block.id,
        action: action,
        resourceType: EnumPendingChangeResourceType.Block,
        versionNumber: lastVersion.versionNumber + 1,
        resource: block
      };
    });
  }

  async getChangedBlocksByCommit(commitId: string): Promise<PendingChange[]> {
    const changedBlocks = await this.prisma.block.findMany({
      where: {
        versions: {
          some: {
            commitId: commitId
          }
        }
      },
      include: {
        lockedByUser: true,
        versions: {
          where: {
            commitId: commitId
          }
        }
      }
    });

    return changedBlocks.map(block => {
      const [changedVersion] = block.versions;
      const action = changedVersion.deleted
        ? EnumPendingChangeAction.Delete
        : changedVersion.versionNumber > 1
        ? EnumPendingChangeAction.Update
        : EnumPendingChangeAction.Create;

      //prepare name fields for display
      if (action === EnumPendingChangeAction.Delete) {
        block.displayName = changedVersion.displayName;
      }

      return {
        resourceId: block.id,
        action: action,
        resourceType: EnumPendingChangeResourceType.Block,
        versionNumber: changedVersion.versionNumber,
        resource: block
      };
    });
  }

  async discardPendingChanges(blockId: string, userId: string): Promise<Block> {
    const blockVersions = await this.prisma.blockVersion.findMany({
      where: {
        block: { id: blockId }
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc
      },
      include: {
        block: true
      }
    });

    const firstBlockVersion = head(blockVersions);
    const lastBlockVersion = last(blockVersions);

    if (!firstBlockVersion || !lastBlockVersion) {
      throw new Error(`Block ${blockId} has no versions `);
    }

    if (firstBlockVersion.block.lockedByUserId !== userId) {
      throw new Error(
        `Cannot discard pending changes on block ${blockId} since it is not currently locked by the requesting user `
      );
    }

    await this.cloneVersionData(lastBlockVersion.id, firstBlockVersion.id);

    return this.releaseLock(blockId);
  }
  private async cloneVersionData(
    sourceVersionId: string,
    targetVersionId: string
  ): Promise<void> {
    const sourceVersion = await this.prisma.blockVersion.findUnique({
      where: {
        id: sourceVersionId
      }
    });

    if (!sourceVersion) {
      throw new Error(`Can't find source (Block Version ${sourceVersionId})`);
    }

    let targetVersion = await this.prisma.blockVersion.findUnique({
      where: {
        id: targetVersionId
      }
    });

    if (!targetVersion) {
      throw new Error(`Can't find target (Block Version ${targetVersionId})`);
    }

    const names = pick(sourceVersion, ['displayName', 'description']);

    //update the target version with its fields, and the its parent block
    targetVersion = await this.prisma.blockVersion.update({
      where: {
        id: targetVersionId
      },
      data: {
        //when the source target is flagged as deleted (commit on DELETE action), do not update the parent block
        block: sourceVersion.deleted
          ? undefined
          : {
              update: {
                ...names,
                deletedAt: null
              }
            },
        ...names,
        settings: sourceVersion.settings,
        inputParameters: sourceVersion.inputParameters,
        outputParameters: sourceVersion.outputParameters
      }
    });
  }
}
