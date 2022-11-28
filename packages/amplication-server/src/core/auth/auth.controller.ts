import {
  Controller,
  UseInterceptors,
  UseGuards,
  Get,
  Res,
  Req,
  UseFilters,
  Inject,
} from "@nestjs/common";
import { MorganInterceptor } from "nest-morgan";
import { Response } from "express";
import { AuthService, AuthUser } from "./auth.service";
import { GithubAuthExceptionFilter } from "../../filters/github-auth-exception.filter";
import { GitHubAuthGuard } from "./github.guard";
import { GitHubRequest } from "./types";
import { stringifyUrl } from "query-string";
import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from "@amplication/nest-logger-module";

@Controller("/")
export class AuthController {
  private host: string;
  constructor(
    private readonly authService: AuthService,
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger
  ) {
    this.host = process.env.CLIENT_HOST || "http://localhost:3001";
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @Get("/github")
  @UseGuards(GitHubAuthGuard)
  async github() {
    return;
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @UseFilters(GithubAuthExceptionFilter)
  @Get("/github/callback")
  @UseGuards(GitHubAuthGuard)
  async githubCallback(
    @Req() request: GitHubRequest,
    @Res() response: Response
  ) {
    const user: AuthUser = request.user as AuthUser;
    const isNew = request.isNew;

    this.logger.log({
      level: "info",
      message: `receive login callback from github account_id=${user.account.id}`,
    });

    const token = await this.authService.prepareToken(user);
    const url = stringifyUrl({
      url: this.host,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      query: { token, "complete-signup": isNew ? "1" : "0" },
    });
    response.redirect(301, url);
  }
}
