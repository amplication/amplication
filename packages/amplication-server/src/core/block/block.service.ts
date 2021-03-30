import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { JsonObject } from 'type-fest';
import head from 'lodash.head';
import last from 'lodash.last';
import {
  Block as PrismaBlock,
  BlockVersion as PrismaBlockVersion
} from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { Block, BlockVersion, IBlock, BlockInputOutput } from 'src/models';

import {
  CreateBlockArgs,
  UpdateBlockArgs,
  FindManyBlockArgs,
  FindManyBlockTypeArgs,
  CreateBlockVersionArgs,
  FindManyBlockVersionArgs
} from './dto';
import { FindOneWithVersionArgs } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';

const NEW_VERSION_LABEL = 'Current Version';
const INITIAL_VERSION_NUMBER = 0;
const ALLOW_NO_PARENT_ONLY = new Set([null]);

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}

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

  /**
   * Creates a block of specific type
   */
  async create<T extends IBlock>(
    args: CreateBlockArgs & {
      data: CreateBlockArgs['data'] & { blockType: keyof typeof EnumBlockType };
    }
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
      parentBlock: parentBlockConnect
    };

    const versionData = {
      label: NEW_VERSION_LABEL,
      versionNumber: INITIAL_VERSION_NUMBER,
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
      blockType
    } = version.block;
    const block: IBlock = {
      id,
      createdAt,
      updatedAt,
      parentBlock,
      displayName,
      description,
      blockType,
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

  async findOne<T extends IBlock>(
    args: FindOneWithVersionArgs
  ): Promise<T | null> {
    const version = await this.prisma.blockVersion.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        blockId_versionNumber: {
          blockId: args.where.id,
          versionNumber: args.version
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
        `Block with ID ${args.where.id} and version ${args.version} was not found`
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
        blockType: { equals: blockType }
      },
      include: {
        versions: {
          where: {
            versionNumber: INITIAL_VERSION_NUMBER
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
        inputParameters: currentVersion.inputParameters,
        outputParameters: currentVersion.outputParameters,
        settings: currentVersion.settings,
        label: args.data.label,
        versionNumber: nextVersionNumber,
        block: {
          connect: {
            id: blockId
          }
        }
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        versionNumber: true,
        label: true,
        block: true
      }
    });
  }

  async getVersions(args: FindManyBlockVersionArgs): Promise<BlockVersion[]> {
    return this.prisma.blockVersion.findMany({
      ...args,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        versionNumber: true,
        label: true,
        block: true
      }
    });
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
  async update<T extends IBlock>(args: UpdateBlockArgs): Promise<T> {
    const { displayName, description, ...settings } = args.data;

    const version = await this.prisma.blockVersion.update({
      data: {
        settings: settings,
        block: {
          update: {
            displayName,
            description
          }
        }
      },
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        blockId_versionNumber: {
          blockId: args.where.id,
          versionNumber: INITIAL_VERSION_NUMBER
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
  }
}
