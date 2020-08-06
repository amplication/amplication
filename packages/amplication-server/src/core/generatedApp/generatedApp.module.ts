import { Module } from '@nestjs/common';
import { GeneratedAppService } from './generatedApp.service';

@Module({
  providers: [GeneratedAppService],
  exports: [GeneratedAppService]
})
export class GeneratedAppModule {}
