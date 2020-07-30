import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export type User = {
  id: string;
  username: string;
  password: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string): Promise<User | null> {
    return this.prisma.user.findOne({ where: { username } });
  }
}
