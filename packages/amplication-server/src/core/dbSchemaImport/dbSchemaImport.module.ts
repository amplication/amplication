import { PrismaModule } from "../../prisma";
import { ActionModule } from "../action/action.module";
import { EntityModule } from "../entity/entity.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { UserActionModule } from "../userAction/userActionModule";
import { DBSchemaImportController } from "./dbSchemaImport.controller";
import { DBSchemaImportResolver } from "./dbSchemaImport.resolver";
import { DBSchemaImportService } from "./dbSchemaImport.service";
import { KafkaModule } from "@amplication/util/nestjs/kafka";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    PermissionsModule,
    KafkaModule,
    PrismaModule,
    EntityModule,
    UserModule,
    ActionModule,
    UserActionModule,
  ],
  controllers: [DBSchemaImportController],
  providers: [DBSchemaImportService, DBSchemaImportResolver],
  exports: [DBSchemaImportService, DBSchemaImportResolver],
})
export class DBSchemaImportModule {}
