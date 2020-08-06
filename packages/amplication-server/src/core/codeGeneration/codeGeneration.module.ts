import { Module } from '@nestjs/common';
import { CodeGenerationService } from './codeGeneration.service';

@Module({
  providers: [CodeGenerationService],
  exports: [CodeGenerationService]
})
export class CodeGenerationModule {}
