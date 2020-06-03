import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import {
  ConnectorRestApi,
  CreateConnectorRestApiArgs,
  FindManyConnectorRestApiArgs,
  ConnectorRestApiSettings
} from './dto/';
import { BlockService } from '../block/block.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { FindOneWithVersionArgs } from 'src/dto';

@Injectable()
export class ConnectorRestApiService {
  constructor(
    private readonly prisma: PrismaService,
    private blockService: BlockService
  ) {}

  async create(args: CreateConnectorRestApiArgs): Promise<ConnectorRestApi> {
    const block = await this.blockService.create({
      data: {
        ...args.data,
        blockType: EnumBlockType.ConnectorRestApi,
        settings: args.data.settings
      }
    });

    return block; //new ConnectorRestApi(block);
  }

  async findOne(
    args: FindOneWithVersionArgs
  ): Promise<ConnectorRestApi | null> {
    const block = await this.blockService.findOne<ConnectorRestApiSettings>(
      args
    );

    return block;
  }

  async findMany(
    args: FindManyConnectorRestApiArgs
  ): Promise<ConnectorRestApi[]> {
    const blocks = await this.blockService.findManyByBlockType(
      args,
      EnumBlockType.ConnectorRestApi
    );

    return blocks;
  }
}
