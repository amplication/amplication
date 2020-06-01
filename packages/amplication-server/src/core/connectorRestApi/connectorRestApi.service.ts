import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ConnectorRestApi } from './dto/ConnectorRestApi';
import { BlockService } from '../block/block.service';
import { CreateConnectorRestApiArgs } from './dto/CreateConnectorRestApiArgs';
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
}
