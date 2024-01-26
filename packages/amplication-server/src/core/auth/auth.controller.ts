import {
  Controller,
  UseInterceptors,
  UseGuards,
  Get,
  Res,
  Req,
  UseFilters,
  Inject,
  Post,
  Query,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MorganInterceptor } from "nest-morgan";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { GithubAuthExceptionFilter } from "../../filters/github-auth-exception.filter";
import { GitHubAuthGuard } from "./github.guard";
import { AuthProfile, AuthUser, GitHubRequest } from "./types";
import { stringifyUrl } from "query-string";
import { Env } from "../../env";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { AuthExceptionFilter } from "../../filters/auth-exception.filter";
import { requiresAuth } from "express-openid-connect";
import { EnumPreviewAccountType } from "./dto/EnumPreviewAccountType";
export const AUTH_LOGIN_PATH = "/auth/login";
export const AUTH_LOGOUT_PATH = "/auth/logout";
export const AUTH_CALLBACK_PATH = "/auth/callback";
export const AUTH_AFTER_CALLBACK_PATH = "/auth/afterCallback";

@Controller("/")
export class AuthController {
  private clientHost: string;
  private host: string;

  constructor(
    private readonly authService: AuthService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger,
    private readonly configService: ConfigService
  ) {
    this.clientHost = configService.get(Env.CLIENT_HOST);
    this.host = `${configService.get(Env.HOST)}`;
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
      url: this.clientHost,
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

  @UseInterceptors(MorganInterceptor("combined"))
  @Get(AUTH_LOGIN_PATH)
  async auth0Login(@Req() request: Request, @Res() response: Response) {
    try {
      const screenHint = request.query.work_email
        ? {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            screen_hint: "signup",
            // eslint-disable-next-line @typescript-eslint/naming-convention
            login_hint: request.query.work_email as string,
          }
        : // eslint-disable-next-line @typescript-eslint/naming-convention
          { screen_hint: "login-id" };
      await response.oidc.login({
        authorizationParams: {
          ...screenHint,
        },
        returnTo: AUTH_AFTER_CALLBACK_PATH,
      });
      return;
    } catch (error) {
      this.logger.error(error.message, error);
      return (
        error.body.friendly_message || "Please enter a valid work email address"
      );
    }
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @UseFilters(AuthExceptionFilter)
  @Get(AUTH_CALLBACK_PATH)
  async auth0Callback(
    @Query("error") error: string | undefined,
    @Query("error_description") errorDescription: string | undefined,
    @Res() response: Response
  ) {
    if (error) {
      throw new Error(errorDescription);
    }
    await response.oidc.callback({
      redirectUri: `${this.host}/${AUTH_CALLBACK_PATH}`,
    });
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @UseFilters(AuthExceptionFilter)
  @Post(AUTH_CALLBACK_PATH)
  async auth0CallbackPost(
    @Query("error") error: string | undefined,
    @Query("error_description") errorDescription: string | undefined,
    @Res() response: Response
  ) {
    if (error) {
      throw new Error(errorDescription);
    }
    await response.oidc.callback({
      redirectUri: `${this.host}/${AUTH_CALLBACK_PATH}`,
    });
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @UseFilters(AuthExceptionFilter)
  @Get(AUTH_LOGOUT_PATH)
  async auth0Logout(@Req() request: Request, @Res() response: Response) {
    await response.oidc.logout({
      returnTo: `${this.clientHost}/login`,
    });
  }

  @UseInterceptors(MorganInterceptor("combined"))
  @UseFilters(AuthExceptionFilter)
  @Get(AUTH_AFTER_CALLBACK_PATH)
  async authorisationCode(
    @Req() request: GitHubRequest,
    @Res() response: Response
  ): Promise<void> {
    // Populate the request.oidc.user object
    requiresAuth();

    let isNew: boolean;
    const profile = <AuthProfile>request.oidc.user;

    let user = await this.authService.getAuthUser({
      account: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR: [{ githubId: profile.sub }, { email: profile.email }],
      },
    });

    if (!user) {
      user = await this.authService.createUser(profile);
      isNew = true;
    }
    if (!user.account.githubId || user.account.githubId !== profile.sub) {
      user = await this.authService.updateUser(user, { githubId: profile.sub });
      isNew = false;
    }

    if (
      user.account.previewAccountType === EnumPreviewAccountType.Auth0Signup
    ) {
      user = await this.authService.updateUser(user, {
        previewAccountType: EnumPreviewAccountType.None,
      });
      isNew = true;
    }

    // @todo update the token to include the auth0 expiry / issued at / etc
    const token = await this.authService.prepareToken(user);
    const url = stringifyUrl({
      url: this.clientHost,
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
