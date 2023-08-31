import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { MessageTypeServiceBase } from "./base/messageType.service.base";

@Injectable()
export class MessageTypeService extends MessageTypeServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
