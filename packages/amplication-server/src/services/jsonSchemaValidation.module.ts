import { JsonSchemaValidationService } from "./jsonSchemaValidation.service";
import { Module } from "@nestjs/common";

@Module({
  providers: [JsonSchemaValidationService],
  exports: [JsonSchemaValidationService],
})
export class JsonSchemaValidationModule {}
