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
import { ConfigService } from "@nestjs/config";
import { MorganInterceptor } from "nest-morgan";
import { Response } from "express";
import { AuthService, AuthUser } from "./auth.service";
import { GithubAuthExceptionFilter } from "../../filters/github-auth-exception.filter";
import { GitHubAuthGuard } from "./github.guard";
import { GitHubRequest } from "./types";
import { stringifyUrl } from "query-string";
import { Env } from "../../env";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Controller("/")
export class AuthController {
  private host: string;
  constructor(
    private readonly authService: AuthService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly configService: ConfigService
  ) {
    this.host = configService.get(Env.CLIENT_HOST);
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
  ): Promise<void> {
    const user: AuthUser = request.user as AuthUser;
    const isNew = request.isNew;

    this.logger.info(
      `receive login callback from github account_id=${user.account.id}`
    );

    const token = await this.authService.prepareToken(user);
    const url = stringifyUrl({
      url: this.host,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      query: { "complete-signup": isNew ? "1" : "0" },
    });
    const clientDomain = new URL(url).hostname;

    const cookieDomainParts = clientDomain.split(".");
    const cookieDomain = cookieDomainParts
      .slice(Math.max(cookieDomainParts.length - 2, 0))
      .join(".");

    response.cookie("AJWT", token, {
      domain: cookieDomain,
      secure: true,
    });
    response.redirect(301, url);
  }
}
