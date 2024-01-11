import { ExceptionFiltersModule } from "../../filters/exceptionFilters.module";
import { GqlAuthModule } from "../../guards/gql-auth.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserActionController } from "./action.controller";
import { ActionResolver } from "./action.resolver";
import { ActionService } from "./action.service";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    ExceptionFiltersModule,
    GqlAuthModule,
    PrismaModule,
    PermissionsModule,
    KafkaModule,
  ],
  controllers: [UserActionController],
  providers: [ActionService, ActionResolver],
  exports: [ActionService, ActionResolver],
})
export class ActionModule {}
