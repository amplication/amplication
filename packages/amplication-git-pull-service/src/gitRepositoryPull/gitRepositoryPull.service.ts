import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";

@Injectable()
export class GitRepositoryPullService {
  constructor(protected readonly prisma: PrismaService) {}
}
