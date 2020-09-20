import { Module, HttpModule } from '@nestjs/common';
import { BackgroundService } from './background.service';

@Module({
  imports: [HttpModule],
  providers: [BackgroundService],
  exports: [BackgroundService]
})
export class BackgroundModule {}
