import { PrismaService } from "../../prisma/prisma.service";

import {
  // @ts-ignore
  RELATED_ENTITY,
} from "../../../prisma/generated-prisma-client";

export class Mixin {
  constructor(protected readonly prisma: PrismaService) {}

  async FIND_ONE(parentId: string): Promise<RELATED_ENTITY | null> {
    return this.prisma.DELEGATE.findUnique({
      where: { id: parentId },
    }).PROPERTY();
  }
}
