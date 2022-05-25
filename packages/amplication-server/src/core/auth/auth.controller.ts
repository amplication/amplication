import { WINSTON_MODULE_PROVIDER } from '@amplication/logger';
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
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService, AuthUser } from './auth.service';
import { GithubAuthExceptionFilter } from 'src/filters/github-auth-exception.filter';

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
  @UseGuards(AuthGuard('github'))
  async github() {
    return;
  }

  @UseInterceptors(MorganInterceptor('combined'))
  @UseFilters(GithubAuthExceptionFilter)
  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() request: Request, @Res() response: Response) {
    const user: AuthUser = request.user as AuthUser;
    this.logger.log({
      level: 'info',
      message: `receive login callback from github account_id=${user.account.id}`
    });
    const token = await this.authService.prepareToken(user);
    response.redirect(301, `${this.host}?token=${token}`);
  }
}
