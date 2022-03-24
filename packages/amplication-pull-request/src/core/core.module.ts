import { Module } from "@nestjs/common";
import { PullRequestModule } from "./pull-request";
@Module({
  imports: [PullRequestModule],
})
export class CoreModule {}
