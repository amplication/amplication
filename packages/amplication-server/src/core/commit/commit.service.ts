import { Injectable } from '@nestjs/common';
import { PrismaService } from '@amplication/prisma-db';
import { FindOneCommitArgs } from './dto/FindOneCommitArgs';
import { FindManyCommitArgs } from './dto/FindManyCommitArgs';
import { Commit } from 'src/models';
import { PendingChange } from '../resource/dto';
import { EntityService } from '../entity/entity.service';
import { BlockService } from '../block/block.service';
@Injectable()
export class CommitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entityService: EntityService,
    private readonly blockService: BlockService
  ) {}

  async findOne(args: FindOneCommitArgs): Promise<Commit> {
    return this.prisma.commit.findUnique(args);
  }

  async findMany(args: FindManyCommitArgs): Promise<Commit[]> {
    return this.prisma.commit.findMany(args);
  }

  async getChanges(commitId: string): Promise<PendingChange[]> {
    const [changedBlocks, changedEntities] = await Promise.all([
      this.blockService.getChangedBlocksByCommit(commitId),
      this.entityService.getChangedEntitiesByCommit(commitId)
    ]);

    return [...changedBlocks, ...changedEntities];
  }
}
