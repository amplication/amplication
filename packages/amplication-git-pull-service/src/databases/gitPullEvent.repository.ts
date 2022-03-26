import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import {
  EnumGitPullEventStatus,
  IDatabaseActions,
  IGitPullEvent,
} from "../contracts/databaseActions.interface";

@Injectable()
export class GitPullEventRepository implements IDatabaseActions {
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
