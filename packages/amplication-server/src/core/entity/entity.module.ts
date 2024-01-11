import { PrismaModule } from "../../prisma";
import { DiffModule } from "../../services/diff.module";
import { JsonSchemaValidationModule } from "../../services/jsonSchemaValidation.module";
import { BillingModule } from "../billing/billing.module";
import { ModuleModule } from "../module/module.module";
import { ModuleActionModule } from "../moduleAction/moduleAction.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { PrismaSchemaParserModule } from "../prismaSchemaParser/prismaSchemaParser.module";
import { ServiceSettingsModule } from "../serviceSettings/serviceSettings.module";
import { UserModule } from "../user/user.module";
import { EntityResolver } from "./entity.resolver";
import { EntityService } from "./entity.service";
import { EntityVersionResolver } from "./entityVersion.resolver";
import { Module } from "@nestjs/common";

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    UserModule,
    JsonSchemaValidationModule,
    DiffModule,
    PrismaSchemaParserModule,
    BillingModule,
    ServiceSettingsModule,
    ModuleModule,
    ModuleActionModule,
  ],
  providers: [EntityService, EntityResolver, EntityVersionResolver],
  exports: [EntityService, EntityResolver, EntityVersionResolver],
})
export class EntityModule {}
