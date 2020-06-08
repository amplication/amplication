import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import {
  ConnectorRestApi,
  CreateConnectorRestApiArgs,
  FindManyConnectorRestApiArgs,
  ConnectorRestApiSettings
} from './dto/';

import { BlockVersion } from 'src/models';

import { BlockService } from '../block/block.service';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { FindOneWithVersionArgs } from 'src/dto';

import { CreateBlockVersionArgs, FindManyBlockVersionArgs } from '../block/dto';

@Injectable()
export class ConnectorRestApiService {
  constructor(
    private readonly prisma: PrismaService,
    private blockService: BlockService
  ) {}

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
    return this.blockService.findOne<ConnectorRestApiSettings>(args);
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
