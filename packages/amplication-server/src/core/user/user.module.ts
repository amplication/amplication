import { PrismaModule } from "../../prisma/prisma.module";
import { BillingModule } from "../billing/billing.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";

@Module({
  imports: [PrismaModule, PermissionsModule, KafkaModule, BillingModule],
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver],
})
export class UserModule {}
