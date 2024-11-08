import { Module } from "@nestjs/common";
import { PrismaModule } from "../../prisma/prisma.module";
import { PermissionsModule } from "../permissions/permissions.module";
import { CustomPropertyResolver } from "./customProperty.resolver";
import { CustomPropertyService } from "./customProperty.service";

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [CustomPropertyResolver, CustomPropertyService],
  exports: [CustomPropertyResolver, CustomPropertyService],
})
export class CustomPropertyModule {}
