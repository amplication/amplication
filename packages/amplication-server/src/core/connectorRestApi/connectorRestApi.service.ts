import { Injectable } from '@nestjs/common';
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
  constructor(private blockService: BlockService) {}

  async create(args: CreateConnectorRestApiArgs): Promise<ConnectorRestApi> {
    return this.blockService.create({
      data: {
        ...args.data,
        blockType: EnumBlockType.ConnectorRestApi
      }
    });
  }

  async findOne(
    args: FindOneWithVersionArgs
  ): Promise<ConnectorRestApi | null> {
    return this.blockService.findOne<ConnectorRestApi>(args);
  }

  async findMany(
    args: FindManyConnectorRestApiArgs
  ): Promise<ConnectorRestApi[]> {
    return this.blockService.findManyByBlockType(
      args,
      EnumBlockType.ConnectorRestApi
    );
  }
}
