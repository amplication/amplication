import { Module } from "@nestjs/common";
import { PrismaSchemaImportService } from "./prismaSchemaImport.service";
import { PrismaSchemaImportController } from "./prismaSchemaImport.controller";

@Module({
  controllers: [PrismaSchemaImportController],
  providers: [PrismaSchemaImportService],
  exports: [PrismaSchemaImportService],
})
export class PrismaSchemaImportModule {}
