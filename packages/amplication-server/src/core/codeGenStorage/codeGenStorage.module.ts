import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CodeGenStorageService } from './codeGenStorage.service';

@Module({
  imports: [ConfigModule],
  providers: [CodeGenStorageService],
  exports: [CodeGenStorageService]
})
export class CodeGenStorageModule { }
