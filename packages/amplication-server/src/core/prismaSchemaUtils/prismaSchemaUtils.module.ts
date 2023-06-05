import { Module } from "@nestjs/common";
import { PrismaSchemaUtilsService } from "./prismaSchemaUtils.service";
import { PrismaSchemaUtilsController } from "./prismaSchemaUtils.controller";

@Module({
  controllers: [PrismaSchemaUtilsController],
  providers: [PrismaSchemaUtilsService],
  exports: [PrismaSchemaUtilsService],
})
export class PrismaSchemaImportModule {}
