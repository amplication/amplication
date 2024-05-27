import { Module } from "@nestjs/common";
import { JsonSchemaValidationModule } from "../../services/jsonSchemaValidation.module";
import { DiffModule } from "../../services/diff.module";
import { EntityService } from "./entity.service";
import { EntityResolver } from "./entity.resolver";
import { EntityVersionResolver } from "./entityVersion.resolver";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { PrismaModule } from "../../prisma";
import { PrismaSchemaParserModule } from "../prismaSchemaParser/prismaSchemaParser.module";
import { BillingModule } from "../billing/billing.module";
import { ServiceSettingsModule } from "../serviceSettings/serviceSettings.module";
import { ModuleModule } from "../module/module.module";
import { ModuleActionModule } from "../moduleAction/moduleAction.module";
import { ModuleDtoModule } from "../moduleDto/moduleDto.module";

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
    ModuleDtoModule,
  ],
  providers: [EntityService, EntityResolver, EntityVersionResolver],
  exports: [EntityService, EntityResolver, EntityVersionResolver],
})
export class EntityModule {}
