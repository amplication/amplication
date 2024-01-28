import { PrismaService } from "../../prisma/prisma.service";

import { RELATED_ENTITY } from "@prisma/client";

declare class PARENT_ID_TYPE {}

export class Mixin {
  constructor(protected readonly prisma: PrismaService) {}

  async FIND_ONE(parentId: PARENT_ID_TYPE): Promise<RELATED_ENTITY | null> {
    return this.prisma.DELEGATE.findUnique({
      where: { id: parentId },
    }).PROPERTY();
  }
}
