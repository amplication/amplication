import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { GitRepositoryPull, IDatabase } from "../../contracts/database.interface";

@Injectable()
export class DatabaseService {
  constructor(protected readonly prisma: PrismaService) {
  }

  create(entity: GitRepositoryPull) {}

  update(entity: GitRepositoryPull) {}

  remove(id: number) {}
}