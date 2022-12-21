import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserServiceBase } from "./base/user.service.base";

@Injectable()
export class UserService extends UserServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
