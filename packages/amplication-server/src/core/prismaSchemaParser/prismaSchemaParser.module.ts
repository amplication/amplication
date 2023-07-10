import { Module } from "@nestjs/common";
import { PrismaSchemaParserService } from "./prismaSchemaParser.service";

@Module({
  providers: [PrismaSchemaParserService],
  exports: [PrismaSchemaParserService],
})
export class PrismaSchemaParserModule {}
