import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Block, BlockVersion } from 'src/models';

import { Block as PrismaBlock } from '@prisma/client';

import {
  CreateBlockArgs,
  FindManyBlockArgs,
  CreateBlockVersionArgs,
  FindManyBlockVersionArgs
} from './dto/';
import { FindOneWithVersionArgs } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import head from 'lodash.head';
import last from 'lodash.last';

const NEW_VERSION_LABEL = 'Current Version';
const INITIAL_VERSION_NUMBER = 0;

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}

  blockTypeAllowedParents = {
    [EnumBlockType.ConnectorRestApiCall]: new Set([
      EnumBlockType.ConnectorRestApi
    ]),
    [EnumBlockType.ConnectorRestApi]: new Set([EnumBlockType.flow])
  };

  /** A wrapper around prisma.blockVersion.create to cast return type to Block Version model */
  private async createBlockVersion<T>(args): Promise<BlockVersion<T>> {
    const version = await this.prisma.blockVersion.create(args);
    return (version as unknown) as BlockVersion<T>;
  }

  /** A wrapper around prisma.blockVersion.findMany to cast return type to Block Version model */
  private async findBlockVersions<T>(args): Promise<BlockVersion<T>[]> {
    const versions = await this.prisma.blockVersion.findMany(args);
    return (versions as unknown) as BlockVersion<T>[];
  }

  async create<T>(args: CreateBlockArgs<T>): Promise<Block<T>> {
    // validate that the parent block is from the same app, and that the link between the two types is allowed
    if (args.data?.parentBlock?.connect?.id) {
      const parentBlock = await this.prisma.block.findOne({
        where: {
          id: args.data.parentBlock.connect.id
        }
      });

      if (!parentBlock || parentBlock.appId !== args.data.app.connect.id) {
        throw new NotFoundException(
          `Can't find parent block with ID ${args.data.parentBlock.connect.id}`
        );
      }

      if (
        !this.canUseParentType(
          EnumBlockType[args.data.blockType],
          EnumBlockType[parentBlock.blockType]
        )
      ) {
        throw new ConflictException(
          `Block type ${parentBlock.blockType} is not allowed as a parent for block type ${args.data.blockType}`
        );
      }
    }

    const newBlock = await this.prisma.block.create({
      data: {
        name: args.data.name,
        description: args.data.description,
        app: args.data.app,
        blockType: args.data.blockType,
        parentBlock: args.data.parentBlock
      }
    });

    // Create first entry on BlockVersion by default when new block is created
    const version = await this.createBlockVersion<T>({
      data: {
        label: NEW_VERSION_LABEL,
        versionNumber: INITIAL_VERSION_NUMBER,
        block: {
          connect: {
            id: newBlock.id
          }
        },
        inputParameters: { params: args.data.inputParameters },
        outputParameters: {
          params: args.data.outputParameters
        },
        settings: (args.data.settings as unknown) as object
      }
    });

    return this.generateBlockWithVersionFields<T>(newBlock, version);
  }

  async findOne<T>(args: FindOneWithVersionArgs): Promise<Block<T> | null> {
    //
    const version = await this.getBlockVersion<T>(args.where.id, args.version);

    if (!version) {
      throw new NotFoundException(
        `Cannot find block`
      ); /**  @todo: change phrasing */
    }
    /**  @todo: add exception handling layer on the resolver level to convert to ApolloError */

    const block = await this.prisma.block.findOne({
      where: {
        id: args.where.id
      }
    });

    return this.generateBlockWithVersionFields<T>(block, version);
  }

  async findMany(args: FindManyBlockArgs): Promise<Block<any>[]> {
    return await this.prisma.block.findMany(args);
  }

  async findManyByBlockType(
    args: FindManyBlockArgs,
    blockType: EnumBlockType
  ): Promise<Block<any>[]> {
    const argsWithType: FindManyBlockArgs = args;

    argsWithType.where = argsWithType.where || {};
    argsWithType.where.blockType = { equals: blockType };

    return this.findMany(argsWithType);
  }

  private async getBlockVersion<T>(
    blockId: string,
    versionNumber: number
  ): Promise<BlockVersion<T>> {
    const blockVersions = await this.findBlockVersions<T>({
      where: {
        block: { id: blockId },
        versionNumber: versionNumber || 0
      }
    });

    const [version] = blockVersions;

    return version;
  }

  async createVersion<T>(args: CreateBlockVersionArgs): Promise<Block<T>> {
    const blockId = args.data.block.connect.id;
    const versions = await this.findBlockVersions<T>({
      where: {
        block: { id: blockId }
      }
    });
    const currentVersion = head(versions); //version 0

    const lastVersion = last(versions);
    if (!currentVersion) {
      throw new Error(`Block ${blockId} has no current version`);
    }
    const lastVersionNumber = lastVersion.versionNumber;

    const nextVersionNumber = lastVersionNumber + 1;

    const newBlockVersion = await this.createBlockVersion<T>({
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
      }
    });

    const block = await this.prisma.block.findOne({
      where: {
        id: blockId
      }
    });

    return this.generateBlockWithVersionFields<T>(block, newBlockVersion);
  }

  private generateBlockWithVersionFields<T>(
    block: PrismaBlock,
    blockVersion: BlockVersion<T>
  ) {
    const b: Block<T> = {
      ...block,
      settings: blockVersion.settings,
      versionNumber: blockVersion.versionNumber,
      inputParameters: blockVersion.inputParameters.params,
      outputParameters: blockVersion.outputParameters.params
    };

    return b;
  }

  async getVersions<T>(
    args: FindManyBlockVersionArgs
  ): Promise<BlockVersion<T>[]> {
    return this.findBlockVersions<T>(args);
  }

  public canUseParentType(
    blockType: EnumBlockType,
    parentType: EnumBlockType
  ): boolean {
    return this.blockTypeAllowedParents[blockType].has(parentType);
  }

  public async getParentBlock(block: Block<any>): Promise<Block<any>> {
    if (block.parentBlockId == null) return null;

    if (block.parentBlock) {
      return block.parentBlock;
    }
    return this.findOne({
      where: {
        id: block.parentBlockId
      },
      version: 0
    });
  }
}
