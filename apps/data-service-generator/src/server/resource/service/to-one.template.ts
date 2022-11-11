import { PrismaService } from "nestjs-prisma";

import {
  // @ts-ignore
  RELATED_ENTITY,
} from "@prisma/client";

export class Mixin {
  constructor(protected readonly prisma: PrismaService) {}

  async FIND_ONE(parentId: string): Promise<RELATED_ENTITY | null> {
    return this.prisma.DELEGATE.findUnique({
      where: { id: parentId },
    }).PROPERTY();
  }
}
