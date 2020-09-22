import { Injectable } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import {
  // @ts-ignore
  ENTITY,
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
} from "@prisma/client";

declare interface ENTITY {}
declare interface CREATE_ARGS {}
declare interface FIND_MANY_ARGS {}
declare interface FIND_ONE_ARGS {}
declare interface UPDATE_ARGS {}
declare interface DELETE_ARGS {}

declare interface PrismaService {
  DELEGATE: {
    create(args: CREATE_ARGS): Promise<ENTITY>;
    findMany(args: FIND_MANY_ARGS): Promise<ENTITY[]>;
    findOne(args: FIND_ONE_ARGS): Promise<ENTITY | null>;
    update(args: UPDATE_ARGS): Promise<ENTITY | null>;
    delete(args: DELETE_ARGS): Promise<ENTITY | null>;
  };
}

@Injectable()
export class SERVICE {
  constructor(private readonly prisma: PrismaService) {}
  create(args: CREATE_ARGS): Promise<ENTITY> {
    return this.prisma.DELEGATE.create(args);
  }
  findMany(args: FIND_MANY_ARGS): Promise<ENTITY[]> {
    return this.prisma.DELEGATE.findMany(args);
  }
  findOne(args: FIND_ONE_ARGS): Promise<ENTITY | null> {
    return this.prisma.DELEGATE.findOne(args);
  }
  update(args: UPDATE_ARGS): Promise<ENTITY | null> {
    return this.prisma.DELEGATE.update(args);
  }
  delete(args: DELETE_ARGS): Promise<ENTITY | null> {
    return this.prisma.DELEGATE.delete(args);
  }
}
