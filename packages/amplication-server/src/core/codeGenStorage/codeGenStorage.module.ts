import { Module } from '@nestjs/common';
import { CodeGenStorageService } from './codeGenStorage.service';

@Module({
  imports: [],
  providers: [CodeGenStorageService],
  exports: [CodeGenStorageService]
})
export class CodeGenModule { }
