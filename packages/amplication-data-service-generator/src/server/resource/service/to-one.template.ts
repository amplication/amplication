import { PrismaService } from "nestjs-prisma";

import {
  // @ts-ignore
  RELATED_ENTITY,
  // @ts-ignore
  ENTITY,
} from "@prisma/client";

export class Mixin {
  constructor(protected readonly prisma: PrismaService) {}

  async FIND_ONE(parent: ENTITY): Promise<RELATED_ENTITY | null> {
    return this.prisma.DELEGATE.findOne({
      where: { id: parent.id },
    }).PROPERTY();
  }
}
