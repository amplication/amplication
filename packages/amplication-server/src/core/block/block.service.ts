import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { OrderByArg } from '@prisma/client';
import { Block, BlockVersion } from 'src/models';
import { CreateBlockArgs } from './dto/CreateBlockArgs';
import { FindOneWithVersionArgs } from 'src/dto';

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

    // Create first entry on BlockVersion by default when new block is created
    await this.prisma.blockVersion.create({
      data: {
        label: args.data.name + ' current version',
        versionNumber: 0,
        block: {
          connect: {
            id: newBlock.id
          }
        },
        inputParameters: '',
        outputParameters: '',
        configuration: args.data.configuration
      }
    });

    newBlock.configuration = args.data.configuration;

    return newBlock;
  }

  async findOne(args: FindOneWithVersionArgs): Promise<Block | null> {
    //
    const version = await this.getBLockVersion(args.where.id, args.version);

    if (!version) {
      throw new NotFoundException(`Cannot find block`); //todo: change phrasing
    }

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

  private async getBLockVersion(
    blockId: string,
    versionNumber: number
  ): Promise<BlockVersion> {
    let blockVersions;
    if (versionNumber) {
      blockVersions = await this.prisma.blockVersion.findMany({
        where: {
          block: { id: blockId },
          versionNumber: versionNumber
        }
      });
    } else {
      blockVersions = await this.prisma.blockVersion.findMany({
        where: {
          block: { id: blockId }
        },
        orderBy: { versionNumber: OrderByArg.asc }
      });
    }
    return (blockVersions && blockVersions.length && blockVersions[0]) || null;
  }
}
