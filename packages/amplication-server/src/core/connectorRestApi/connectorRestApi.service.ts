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

  /**  @todo: should we use a generic BlockResolver for the following functions (createVersion, getVersions... ) */

  async createVersion<T>(
    args: CreateBlockVersionArgs
  ): Promise<ConnectorRestApi> {
    return this.blockService.createVersion<ConnectorRestApiSettings>(args);
  }

  async getVersions(args: FindManyBlockVersionArgs): Promise<BlockVersion[]> {
    return this.prisma.blockVersion.findMany(args);
  }
}
