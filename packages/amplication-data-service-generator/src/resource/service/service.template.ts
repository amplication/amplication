import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import {
  // @ts-ignore
  CREATE_ARGS,
  // @ts-ignore
  FIND_MANY_ARGS,
  // @ts-ignore
  FIND_ONE_ARGS,
  // @ts-ignore
  UPDATE_ARGS,
  // @ts-ignore
  DELETE_ARGS,
  // @ts-ignore
  Subset,
} from "@prisma/client";

@Injectable()
export class SERVICE {
  constructor(private readonly prisma: PrismaService) {}
  create<T extends CREATE_ARGS>(args: Subset<T, CREATE_ARGS>) {
    return this.prisma.DELEGATE.create(args);
  }
  findMany<T extends FIND_MANY_ARGS>(args: Subset<T, FIND_MANY_ARGS>) {
    return this.prisma.DELEGATE.findMany(args);
  }
  findOne<T extends FIND_ONE_ARGS>(args: Subset<T, FIND_ONE_ARGS>) {
    return this.prisma.DELEGATE.findOne(args);
  }
  update<T extends UPDATE_ARGS>(args: Subset<T, UPDATE_ARGS>) {
    return this.prisma.DELEGATE.update(args);
  }
  delete<T extends DELETE_ARGS>(args: Subset<T, DELETE_ARGS>) {
    return this.prisma.DELEGATE.delete(args);
  }
}
