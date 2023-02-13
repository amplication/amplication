import {
  Controller,
  Get,
  Query,
  Redirect,
  UseInterceptors,
} from "@nestjs/common";
import { MorganInterceptor } from "nest-morgan";
import { GitProviderService } from "./git.provider.service";

@Controller()
export class GitAuthController {
  constructor(private readonly gitProviderService: GitProviderService) {}

  @UseInterceptors(MorganInterceptor("combined"))
  @Get("/bitbucket/callback")
  @Redirect("localhost:3000", 301)
  async bitbucketCallback(@Query() code: string) {
    await this.gitProviderService.getAuthByTemporaryCode(code);

    // refresh token (workspace) --> db
  }
}
