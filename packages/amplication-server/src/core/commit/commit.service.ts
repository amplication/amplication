import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { FindManyCommitArgs, FindOneCommitArgs } from 'prisma/dal';
import { Commit } from 'src/models';

@Injectable()
export class CommitService {
  constructor(private readonly prisma: PrismaService) {}

  async getCommit(args: FindOneCommitArgs): Promise<Commit> {
    return this.prisma.commit.findOne(args);
  }

  async getCommits(args: FindManyCommitArgs): Promise<Commit[]> {
    return this.prisma.commit.findMany(args);
  }
}
