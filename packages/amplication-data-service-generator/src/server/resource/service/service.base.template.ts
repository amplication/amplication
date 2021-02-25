import { PrismaService } from "nestjs-prisma";
import {
  // @ts-ignore
  FIND_ONE_ARGS,
  // @ts-ignore
  FIND_MANY_ARGS,
  // @ts-ignore
  CREATE_ARGS,
  // @ts-ignore
  UPDATE_ARGS,
  // @ts-ignore
  DELETE_ARGS,
  // @ts-ignore
  Subset,
} from "@prisma/client";

declare const CREATE_ARGS_MAPPING: CREATE_ARGS;
declare const UPDATE_ARGS_MAPPING: UPDATE_ARGS;

export class SERVICE_BASE {
  constructor(protected readonly prisma: PrismaService) {}
  findMany<T extends FIND_MANY_ARGS>(args: Subset<T, FIND_MANY_ARGS>) {
    return this.prisma.DELEGATE.findMany(args);
  }
  findOne<T extends FIND_ONE_ARGS>(args: Subset<T, FIND_ONE_ARGS>) {
    return this.prisma.DELEGATE.findOne(args);
  }
  create<T extends CREATE_ARGS>(args: Subset<T, CREATE_ARGS>) {
    // @ts-ignore
    return this.prisma.DELEGATE.create<T>(CREATE_ARGS_MAPPING);
  }
  update<T extends UPDATE_ARGS>(args: Subset<T, UPDATE_ARGS>) {
    // @ts-ignore
    return this.prisma.DELEGATE.update<T>(UPDATE_ARGS_MAPPING);
  }
  delete<T extends DELETE_ARGS>(args: Subset<T, DELETE_ARGS>) {
    return this.prisma.DELEGATE.delete(args);
  }
}
