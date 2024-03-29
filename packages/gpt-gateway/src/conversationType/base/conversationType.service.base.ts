/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { PrismaService } from "../../prisma/prisma.service";
import {
  Prisma,
  ConversationType,
  Template,
} from "../../../prisma/generated-prisma-client";

export class ConversationTypeServiceBase {
  constructor(protected readonly prisma: PrismaService) {}

  async count<T extends Prisma.ConversationTypeCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.ConversationTypeCountArgs>
  ): Promise<number> {
    return this.prisma.conversationType.count(args);
  }

  async conversationTypes<T extends Prisma.ConversationTypeFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.ConversationTypeFindManyArgs>
  ): Promise<ConversationType[]> {
    return this.prisma.conversationType.findMany(args);
  }
  async conversationType<T extends Prisma.ConversationTypeFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.ConversationTypeFindUniqueArgs>
  ): Promise<ConversationType | null> {
    return await this.prisma.conversationType.findUnique(args);
  }
  async createConversationType<T extends Prisma.ConversationTypeCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ConversationTypeCreateArgs>
  ): Promise<ConversationType> {
    return this.prisma.conversationType.create<T>(args);
  }
  async updateConversationType<T extends Prisma.ConversationTypeUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ConversationTypeUpdateArgs>
  ): Promise<ConversationType> {
    return this.prisma.conversationType.update<T>(args);
  }
  async deleteConversationType<T extends Prisma.ConversationTypeDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.ConversationTypeDeleteArgs>
  ): Promise<ConversationType> {
    return this.prisma.conversationType.delete(args);
  }

  async getTemplate(parentId: string): Promise<Template | null> {
    return this.prisma.conversationType
      .findUnique({
        where: { id: parentId },
      })
      .template();
  }
}
