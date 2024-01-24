import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserResolver } from "./user.resolver";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { BillingModule } from "../billing/billing.module";

@Module({
  imports: [PrismaModule, PermissionsModule, KafkaModule, BillingModule],
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver],
})
export class UserModule {}
