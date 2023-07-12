import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma";
import { CreateUserActionArgs, UserAction } from "./dto";
import { FindOneUserActionArgs } from "./dto/FindOneUserActionArgs";

@Injectable()
export class UserActionService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(args: FindOneUserActionArgs): Promise<UserAction | null> {
    return this.prisma.userAction.findUnique(args);
  }

  async create(args: CreateUserActionArgs): Promise<UserAction> {
    return this.prisma.userAction.create({
      data: args.data,
    });
  }
}
