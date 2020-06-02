import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Block, BlockVersion } from 'src/models';
import { CreateBlockArgs, FindManyBlockArgs } from './dto/';
import { FindOneWithVersionArgs } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';

const NEW_VERSION_LABEL = 'Current Version';

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}

  async create(args: CreateBlockArgs): Promise<Block> {
    const newBlock: Block = await this.prisma.block.create({
      data: {
        name: args.data.name,
        description: args.data.description,
        app: args.data.app,
        blockType: args.data.blockType
      }
    });

    const data = {
      label: NEW_VERSION_LABEL,
      versionNumber: 0,
      block: {
        connect: {
          id: newBlock.id
        }
      },
      inputParameters: JSON.stringify(
        {}
      ) /** @todo change field type to JSON */,
      outputParameters: JSON.stringify(
        {}
      ) /** @todo change field type to JSON */,
      configuration: args.data.configuration
    };

    // Create first entry on BlockVersion by default when new block is created
    await this.prisma.blockVersion.create({
      data: data
    });

    newBlock.configuration = args.data.configuration;

    return newBlock;
  }

  async findOne(args: FindOneWithVersionArgs): Promise<Block | null> {
    //
    const version = await this.getBlockVersion(args.where.id, args.version);

    if (!version) {
      throw new NotFoundException(
        `Cannot find block`
      ); /**  @todo: change phrasing */
    }
    /**  @todo: add exception handling layer on the resolver level to convert to ApolloError */

    const block: Block = await this.prisma.block.findOne({
      where: {
        id: args.where.id
      }
    });

    block.versionNumber = version.versionNumber;

    block.configuration = version.configuration;
    block.inputParameters = version.inputParameters;
    block.outputParameters = version.outputParameters;

    return block;
  }

  async findMany(args: FindManyBlockArgs): Promise<Block[]> {
    return this.prisma.block.findMany(args);
  }

  async findManyByBlockType(
    args: FindManyBlockArgs,
    blockType: EnumBlockType
  ): Promise<Block[]> {
    const argsWithType: FindManyBlockArgs = args;

    argsWithType.where = argsWithType.where || {};
    argsWithType.where.blockType = { equals: blockType };

    return this.findMany(argsWithType);
  }

  private async getBlockVersion(
    blockId: string,
    versionNumber: number
  ): Promise<BlockVersion> {
    const blockVersions = await this.prisma.blockVersion.findMany({
      where: {
        block: { id: blockId },
        versionNumber: versionNumber || 0
      }
    });

    const [version] = blockVersions;

    return version;
  }
}
