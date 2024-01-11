import { Commit } from "../../models";
import { PrismaService } from "../../prisma/prisma.service";
import { BlockService } from "../block/block.service";
import { EntityService } from "../entity/entity.service";
import { PendingChange } from "../resource/dto";
import { FindManyCommitArgs } from "./dto/FindManyCommitArgs";
import { FindOneCommitArgs } from "./dto/FindOneCommitArgs";
import { Injectable } from "@nestjs/common";
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
      this.entityService.getChangedEntitiesByCommit(commitId),
    ]);

    return [...changedBlocks, ...changedEntities];
  }
}
