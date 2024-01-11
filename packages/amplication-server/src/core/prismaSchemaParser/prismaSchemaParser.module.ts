import { PrismaSchemaParserService } from "./prismaSchemaParser.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [PrismaSchemaParserService],
  exports: [PrismaSchemaParserService],
})
export class PrismaSchemaParserModule {}
