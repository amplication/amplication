import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, ENTITY as PRISMA_ENTITY } from "@prisma/client";

declare const CREATE_ARGS_MAPPING: Prisma.CREATE_ARGS;
declare const UPDATE_ARGS_MAPPING: Prisma.UPDATE_ARGS;

export class SERVICE_BASE {
  constructor(protected readonly prisma: PrismaService) {}

  async count(args: Omit<Prisma.COUNT_ARGS, "select">): Promise<number> {
    return this.prisma.DELEGATE.count(args);
  }

  async FIND_MANY_ENTITY_FUNCTION<T extends Prisma.FIND_MANY_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.FIND_MANY_ARGS>
  ): Promise<PRISMA_ENTITY[]> {
    return this.prisma.DELEGATE.findMany<Prisma.FIND_MANY_ARGS>(args);
  }
  async FIND_ONE_ENTITY_FUNCTION<T extends Prisma.FIND_ONE_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.FIND_ONE_ARGS>
  ): Promise<PRISMA_ENTITY | null> {
    return this.prisma.DELEGATE.findUnique(args);
  }
  async CREATE_ENTITY_FUNCTION<T extends Prisma.CREATE_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.CREATE_ARGS>
  ): Promise<PRISMA_ENTITY> {
    return this.prisma.DELEGATE.create<T>(CREATE_ARGS_MAPPING);
  }
  async UPDATE_ENTITY_FUNCTION<T extends Prisma.UPDATE_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.UPDATE_ARGS>
  ): Promise<PRISMA_ENTITY> {
    return this.prisma.DELEGATE.update<T>(UPDATE_ARGS_MAPPING);
  }
  async DELETE_ENTITY_FUNCTION<T extends Prisma.DELETE_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.DELETE_ARGS>
  ): Promise<PRISMA_ENTITY> {
    return this.prisma.DELEGATE.delete(args);
  }
}
