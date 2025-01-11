import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { CustomPropertyResolver } from "./customProperty.resolver";
import { CustomPropertyService } from "./customProperty.service";
import { JsonSchemaValidationModule } from "../../services/jsonSchemaValidation.module";

@Module({
  imports: [PrismaModule, PermissionsModule, JsonSchemaValidationModule],
  providers: [CustomPropertyResolver, CustomPropertyService],
  exports: [CustomPropertyResolver, CustomPropertyService],
})
export class CustomPropertyModule {}
