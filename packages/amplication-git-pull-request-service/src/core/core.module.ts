import { Module } from '@nestjs/common';
import {CommitModule} from "./commit";
@Module({
  imports: [CommitModule],
  exports: [CommitModule],
})
export class CoreModule {}
