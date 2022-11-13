import { Module } from '@nestjs/common';
import { JsonSchemaValidationService } from './jsonSchemaValidation.service';

@Module({
  providers: [JsonSchemaValidationService],
  exports: [JsonSchemaValidationService]
})
export class JsonSchemaValidationModule {}
