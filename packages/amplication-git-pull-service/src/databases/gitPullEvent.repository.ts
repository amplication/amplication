import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import {
  EnumGitPullEventStatus,
  IDatabaseOperations,
  IGitPullEvent,
} from "../contracts/databaseOperations.interface";

/** TODO:
    1. figure out what is the return type of any operation
    2. update / upsert ?
    3. how to find by index
    **/

@Injectable()
export class GitPullEventRepository implements IDatabaseOperations {
  constructor(private readonly prisma: PrismaService) {}

  async create(eventData: IGitPullEvent): Promise<any> {
    return this.prisma.gitPullEvent.create({ data: eventData });
  }

  async update(id: number, status: EnumGitPullEventStatus): Promise<any> {
    return this.prisma.gitPullEvent.update({
      where: { id: id },
      data: { status: status },
    });
  }

  async remove(id: number): Promise<any> {
    return this.prisma.gitPullEvent.delete({ where: { id: id } });
  }
}
