import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ConversationTypeServiceBase } from "./base/conversationType.service.base";

@Injectable()
export class ConversationTypeService extends ConversationTypeServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
