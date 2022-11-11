import { PrismaService } from "nestjs-prisma";
import {
  // @ts-ignore
  Prisma,
  // @ts-ignore
  ENTITY,
} from "@prisma/client";

declare const CREATE_ARGS_MAPPING: Prisma.CREATE_ARGS;
declare const UPDATE_ARGS_MAPPING: Prisma.UPDATE_ARGS;

export class SERVICE_BASE {
  constructor(protected readonly prisma: PrismaService) {}

  async count<T extends Prisma.FIND_MANY_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.FIND_MANY_ARGS>
  ): Promise<number> {
    return this.prisma.DELEGATE.count(args);
  }

  async findMany<T extends Prisma.FIND_MANY_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.FIND_MANY_ARGS>
  ): Promise<ENTITY[]> {
    return this.prisma.DELEGATE.findMany(args);
  }
  async findOne<T extends Prisma.FIND_ONE_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.FIND_ONE_ARGS>
  ): Promise<ENTITY | null> {
    return this.prisma.DELEGATE.findUnique(args);
  }
  async create<T extends Prisma.CREATE_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.CREATE_ARGS>
  ): Promise<ENTITY> {
    // @ts-ignore
    return this.prisma.DELEGATE.create<T>(CREATE_ARGS_MAPPING);
  }
  async update<T extends Prisma.UPDATE_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.UPDATE_ARGS>
  ): Promise<ENTITY> {
    // @ts-ignore
    return this.prisma.DELEGATE.update<T>(UPDATE_ARGS_MAPPING);
  }
  async delete<T extends Prisma.DELETE_ARGS>(
    args: Prisma.SelectSubset<T, Prisma.DELETE_ARGS>
  ): Promise<ENTITY> {
    return this.prisma.DELEGATE.delete(args);
  }
}
