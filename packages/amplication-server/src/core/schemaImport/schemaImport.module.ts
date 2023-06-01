import { Module } from "@nestjs/common";
import { SchemaImportService } from "./schemaImport.service";
import { SchemaImportController } from "./SchemaImport.controller";

@Module({
  controllers: [SchemaImportController],
  providers: [SchemaImportService],
  exports: [SchemaImportService],
})
export class SchemaImportModule {}
