import { PrismaService } from "../../prisma/prisma.service";

import {
  Prisma,
  RELATED_ENTITY as PRISMA_RELATED_ENTITY,
} from "@prisma/client";

declare class PARENT_ID_TYPE {}

export class Mixin {
  constructor(protected readonly prisma: PrismaService) {}

  async FIND_MANY(
    parentId: PARENT_ID_TYPE,
    args: Prisma.ARGS
  ): Promise<PRISMA_RELATED_ENTITY[]> {
    return this.prisma.DELEGATE.findUniqueOrThrow({
      where: { id: parentId },
    }).PROPERTY(args);
  }
}
