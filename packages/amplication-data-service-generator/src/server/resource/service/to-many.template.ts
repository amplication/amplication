import { PrismaService } from "nestjs-prisma";

import {
  // @ts-ignore
  Prisma,
  // @ts-ignore
  RELATED_ENTITY,
} from "@prisma/client";

export class Mixin {
  constructor(protected readonly prisma: PrismaService) {}

  async FIND_MANY(
    parentId: string,
    args: Prisma.ARGS
  ): Promise<RELATED_ENTITY[]> {
    return this.prisma.DELEGATE.findUnique({
      where: { id: parentId },
    }).PROPERTY(args);
  }
}
