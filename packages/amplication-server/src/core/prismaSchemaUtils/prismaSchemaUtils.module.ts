import { Module } from "@nestjs/common";
import { PrismaSchemaUtilsService } from "./prismaSchemaUtils.service";

@Module({
  providers: [PrismaSchemaUtilsService],
  exports: [PrismaSchemaUtilsService],
})
export class PrismaSchemaImportModule {}
