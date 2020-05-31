import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { ConnectorRestApi } from 'src/models/blocks/connectorRestApi/connectorRestApi';
import { CreateOneEntityArgs } from '../entity/dto/CreateOneEntityArgs';
import { BlockService } from '../block/block.service';

@Injectable()
export class ConnectorRestApiService {
  constructor(
    private readonly prisma: PrismaService,
    private blockService: BlockService
  ) {}

  async create(args: CreateOneEntityArgs): Promise<ConnectorRestApi> {
    //todo: call the block service to create a new block
    let a = this.blockService.create(args);
    return new ConnectorRestApi();
  }
}
