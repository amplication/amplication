import { Module } from "@nestjs/common";
import { DiffModule } from "../diff/diff.module";
import { PullRequestResolver } from "./pull-request.resolver";
import { PullRequestService } from "./pull-request.service";
@Module({
  imports: [DiffModule],
  providers: [PullRequestResolver, PullRequestService],
})
export class PullRequestModule {}
