import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MessageServiceBase } from "./base/message.service.base";

@Injectable()
export class MessageService extends MessageServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
