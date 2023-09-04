import { Module } from "@nestjs/common";
import { ExceptionFiltersModule } from "../../filters/exceptionFilters.module";
import { PrismaModule } from "../../prisma/prisma.module";
import { GqlAuthModule } from "../../guards/gql-auth.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { ActionService } from "./action.service";
import { ActionResolver } from "./action.resolver";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { UserActionController } from "./action.controller";

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
