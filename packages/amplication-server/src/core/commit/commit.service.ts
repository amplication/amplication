import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { FindOneCommitArgs } from "./dto/FindOneCommitArgs";
import { FindManyCommitArgs } from "./dto/FindManyCommitArgs";
import { Commit } from "src/models";

@Injectable()
export class CommitService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(args: FindOneCommitArgs): Promise<Commit> {
    return this.prisma.commit.findOne(args);
  }

  async findMany(args: FindManyCommitArgs): Promise<Commit[]> {
    return this.prisma.commit.findMany(args);
  }
}
