import {
  Controller,
  UseInterceptors,
  UseGuards,
  Get,
  Res,
  Req,
  UseFilters,
  Logger,
  Inject
} from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { Response } from 'express';
import { AuthService, AuthUser } from './auth.service';
import { GithubAuthExceptionFilter } from 'src/filters/github-auth-exception.filter';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { GitHubAuthGuard } from './github.guard';
import { GitHubRequest } from './types';
import { stringifyUrl } from 'query-string';

@Controller('/')
export class AuthController {
  private host: string;
  constructor(
    private readonly authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger
  ) {
    this.host = process.env.CLIENT_HOST || 'http://localhost:3001';
  }

  @UseInterceptors(MorganInterceptor('combined'))
  @Get('/github')
  @UseGuards(GitHubAuthGuard)
  async github() {
    return;
  }

  @UseInterceptors(MorganInterceptor('combined'))
  @UseFilters(GithubAuthExceptionFilter)
  @Get('/github/callback')
  @UseGuards(GitHubAuthGuard)
  async githubCallback(
    @Req() request: GitHubRequest,
    @Res() response: Response
  ) {
    const user: AuthUser = request.user as AuthUser;
    const isNew = request.isNew;

    this.logger.log({
      level: 'info',
      message: `receive login callback from github account_id=${user.account.id}`
    });

    const token = await this.authService.prepareToken(user);
    const url = stringifyUrl({
      url: this.host,
      query: { token, 'complete-signup': isNew ? '1' : '0' }
    });
    response.redirect(301, url);
  }
}
