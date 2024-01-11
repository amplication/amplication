import { PrismaService } from "../prisma/prisma.service";
import { MessageServiceBase } from "./base/message.service.base";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MessageService extends MessageServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
