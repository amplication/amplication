import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import {
  ConnectorRestApi,
  CreateConnectorRestApiArgs,
  FindManyConnectorRestApiArgs
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
    //todo: call the block service to create a new block

    const block = await this.blockService.create({
      data: {
        name: args.data.name,
        description: args.data.description,
        app: args.data.app,
        blockType: EnumBlockType.ConnectorRestApi,
        configuration: JSON.stringify(args.data.settings)
      }
    });

    return new ConnectorRestApi(block);
  }

  async findOne(
    args: FindOneWithVersionArgs
  ): Promise<ConnectorRestApi | null> {
    const block = await this.blockService.findOne(args);

    return new ConnectorRestApi(block);
  }

  async findMany(
    args: FindManyConnectorRestApiArgs
  ): Promise<ConnectorRestApi[]> {
    const blocks = await this.blockService.findManyByBlockType(
      args,
      EnumBlockType.ConnectorRestApi
    );

    return blocks.map(block => new ConnectorRestApi(block));
  }
}
