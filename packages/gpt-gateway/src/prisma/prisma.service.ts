import { PrismaClient } from "../../prisma/generated-prisma-client";
import { Injectable, OnModuleInit, INestApplication } from "@nestjs/common";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
