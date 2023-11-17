import {
  INestApplication,
  Inject,
  Injectable,
  OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "../../prisma/generated-prisma-client";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {
    super();
  }
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      this.logger.error("Prisma connection error", error);
    }
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on("beforeExit", async () => {
      await app.close();
    });
  }
}
