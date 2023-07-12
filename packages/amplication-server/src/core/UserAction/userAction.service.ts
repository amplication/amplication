import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma";
import { FindOneUserActionArgs } from "./dto/FindOneUserActionArgs";
import { UserAction } from "./dto";

@Injectable()
export class UserActionService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(args: FindOneUserActionArgs): Promise<UserAction | null> {
    return this.prisma.userAction.findUnique(args);
  }
}
