import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FindOneCommitArgs } from './dto/FindOneCommitArgs';
import { FindManyCommitArgs } from './dto/FindManyCommitArgs';
import { Commit } from 'src/models';
import { PendingChange } from '../app/dto';
import { EntityService } from '../entity/entity.service';
@Injectable()
export class CommitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly entityService: EntityService
  ) {}

  async findOne(args: FindOneCommitArgs): Promise<Commit> {
    return this.prisma.commit.findUnique(args);
  }

  async findMany(args: FindManyCommitArgs): Promise<Commit[]> {
    return this.prisma.commit.findMany(args);
  }

  async getChanges(commitId: string): Promise<PendingChange[]> {
    /**@todo: do the same for Blocks */
    return this.entityService.getChangedEntitiesByCommit(commitId);
  }
}
