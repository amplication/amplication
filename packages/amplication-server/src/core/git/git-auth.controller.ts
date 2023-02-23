import {
  Controller,
  Get,
  Query,
  Redirect,
  UseInterceptors,
} from "@nestjs/common";
import { MorganInterceptor } from "nest-morgan";
import { GitProviderService } from "./git.provider.service";

const host = process.env.CLIENT_HOST || "http://localhost:3001";
@Controller()
export class GitAuthController {
  constructor(private readonly gitProviderService: GitProviderService) {}

  @UseInterceptors(MorganInterceptor("combined"))
  @Get("/bitbucket/callback")
  @Redirect(host, 301)
  async bitbucketCallback(@Query() query: Record<string, string>) {
    return this.gitProviderService.getAuthByTemporaryCode(query.code);
  }
}
