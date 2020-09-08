import { Injectable } from "@nestjs/common";
// eslint-disable-next-line
// @ts-ignore
import { User } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string): Promise<User | null> {
    return this.prisma.user.findOne({ where: { username } });
  }
}
