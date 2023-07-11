import { Module } from "@nestjs/common";
import { DBSchemaImportModule } from "./dbSchemaImport/dbSchemaImport.module";
import { UserActionResolver } from "./userAction.resolver";
import { UserActionService } from "./userAction.service";
import { PrismaModule } from "../../prisma";
import { PermissionsModule } from "../permissions/permissions.module";

@Module({
  imports: [PrismaModule, PermissionsModule, DBSchemaImportModule],
  providers: [UserActionResolver, UserActionService],
  exports: [UserActionResolver, UserActionService],
})
export class UserActionModule {}
