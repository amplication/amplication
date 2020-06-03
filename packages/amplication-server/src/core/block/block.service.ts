import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Block, BlockVersion } from 'src/models';
import { CreateBlockArgs, FindManyBlockArgs } from './dto/';
import { FindOneWithVersionArgs } from 'src/dto';
import { EnumBlockType } from 'src/enums/EnumBlockType';

const NEW_VERSION_LABEL = 'Current Version';
const INITIAL_VERSION_NUMBER = 0;

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}

  async create<T>(args: CreateBlockArgs<T>): Promise<Block<T>> {
    const newBlock = await this.prisma.block.create({
      data: {
        name: args.data.name,
        description: args.data.description,
        app: args.data.app,
        blockType: args.data.blockType
      }
    });

    // Create first entry on BlockVersion by default when new block is created
    await this.prisma.blockVersion.create({
      data: {
        label: NEW_VERSION_LABEL,
        versionNumber: INITIAL_VERSION_NUMBER,
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
        settings: JSON.stringify(args.data.settings)
      }
    });

    const b: Block<T> = {
      ...newBlock,
      versionNumber: INITIAL_VERSION_NUMBER,
      settings: args.data.settings,
      inputParameters: '{}',
      outputParameters: '{}'
    };

    return b;
  }

  async findOne<T>(args: FindOneWithVersionArgs): Promise<Block<T> | null> {
    //
    const version = await this.getBlockVersion(args.where.id, args.version);

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

    const b: Block<T> = {
      ...block,
      settings: JSON.parse(version.settings),
      versionNumber: version.versionNumber,
      inputParameters: version.inputParameters,
      outputParameters: version.outputParameters
    };

    return b;
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
