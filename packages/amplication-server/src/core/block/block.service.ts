import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { Block } from 'src/models/blocks/block';
import { CreateOneEntityArgs } from '../entity/dto/CreateOneEntityArgs';

@Injectable()
export class BlockService {
  constructor(private readonly prisma: PrismaService) {}

  async create(args: CreateOneEntityArgs): Promise<Block> {
    //todo: call the block service to create a new block
    return new Block();
  }
}
