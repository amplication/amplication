import { Injectable } from '@nestjs/common';
import {
  ConnectorRestApiCall,
  CreateConnectorRestApiCallArgs,
  FindManyConnectorRestApiCallArgs
} from './dto/';

import { BlockService } from '../block/block.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { FindOneWithVersionArgs } from 'src/dto';

@Injectable()
export class ConnectorRestApiCallService {
  constructor(private blockService: BlockService) {}

  async create(
    args: CreateConnectorRestApiCallArgs
  ): Promise<ConnectorRestApiCall> {
    return this.blockService.create({
      data: {
        ...args.data,
        blockType: EnumBlockType.ConnectorRestApiCall
      }
    });
  }

  async findOne(
    args: FindOneWithVersionArgs
  ): Promise<ConnectorRestApiCall | null> {
    return this.blockService.findOne<ConnectorRestApiCall>(args);
  }

  async findMany(
    args: FindManyConnectorRestApiCallArgs
  ): Promise<ConnectorRestApiCall[]> {
    return this.blockService.findManyByBlockType(
      args,
      EnumBlockType.ConnectorRestApiCall
    );
  }
}
