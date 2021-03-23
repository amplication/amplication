import { PrismaService } from "nestjs-prisma";

import {
  // @ts-ignore
  ARGS,
  // @ts-ignore
  RELATED_ENTITY,
  // @ts-ignore
  ENTITY,
} from "@prisma/client";

export class Mixin {
  constructor(protected readonly prisma: PrismaService) {}

  async FIND_MANY(parent: ENTITY, args: ARGS): Promise<RELATED_ENTITY[]> {
    return this.prisma.DELEGATE.findOne({
      where: { id: parent.id },
    }).PROPERTY(args);
  }
}
