import { Module } from "@nestjs/common";
import { JsonSchemaValidationModule } from "../../services/jsonSchemaValidation.module";
import { DiffModule } from "../../services/diff.module";
import { EntityService } from "./entity.service";
import { EntityResolver } from "./entity.resolver";
import { EntityVersionResolver } from "./entityVersion.resolver";
import { PermissionsModule } from "../permissions/permissions.module";
import { UserModule } from "../user/user.module";
import { PrismaModule } from "../../prisma";
import { PrismaSchemaImportModule } from "../prismaSchemaUtils/prismaSchemaUtils.module";
import { BillingModule } from "../billing/billing.module";

@Module({
  imports: [
    PrismaModule,
    PermissionsModule,
    UserModule,
    JsonSchemaValidationModule,
    DiffModule,
    PrismaSchemaImportModule,
    BillingModule,
  ],
  providers: [EntityService, EntityResolver, EntityVersionResolver],
  exports: [EntityService, EntityResolver, EntityVersionResolver],
})
export class EntityModule {}
