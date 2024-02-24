import { PrismaService } from "../../prisma/prisma.service";

import { RELATED_ENTITY as PRISMA_RELATED_ENTITY } from "@prisma/client";

declare class PARENT_ID_TYPE {}

export class Mixin {
  constructor(protected readonly prisma: PrismaService) {}

  async FIND_ONE(
    parentId: PARENT_ID_TYPE
  ): Promise<PRISMA_RELATED_ENTITY | null> {
    return this.prisma.DELEGATE.findUnique({
      where: { id: parentId },
    }).PROPERTY();
  }
}
