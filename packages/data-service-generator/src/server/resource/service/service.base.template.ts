import { PrismaService } from "../../prisma/prisma.service";
import { Prisma, ENTITY as PRISMA_ENTITY } from "@prisma/client";

declare const CREATE_ARGS_MAPPING: Prisma.CREATE_ARGS;
declare const UPDATE_ARGS_MAPPING: Prisma.UPDATE_ARGS;

export class SERVICE_BASE {
  constructor(protected readonly prisma: PrismaService) {}

  async count(args: Omit<Prisma.COUNT_ARGS, "select">): Promise<number> {
    return this.prisma.DELEGATE.count(args);
  }

  async FIND_MANY_ENTITY_FUNCTION(
    args: Prisma.FIND_MANY_ARGS
  ): Promise<PRISMA_ENTITY[]> {
    return this.prisma.DELEGATE.findMany(args);
  }
  async FIND_ONE_ENTITY_FUNCTION(
    args: Prisma.FIND_ONE_ARGS
  ): Promise<PRISMA_ENTITY | null> {
    return this.prisma.DELEGATE.findUnique(args);
  }
  async CREATE_ENTITY_FUNCTION(
    args: Prisma.CREATE_ARGS
  ): Promise<PRISMA_ENTITY> {
    return this.prisma.DELEGATE.create(CREATE_ARGS_MAPPING);
  }
  async UPDATE_ENTITY_FUNCTION(
    args: Prisma.UPDATE_ARGS
  ): Promise<PRISMA_ENTITY> {
    return this.prisma.DELEGATE.update(UPDATE_ARGS_MAPPING);
  }
  async DELETE_ENTITY_FUNCTION(
    args: Prisma.DELETE_ARGS
  ): Promise<PRISMA_ENTITY> {
    return this.prisma.DELEGATE.delete(args);
  }
}
