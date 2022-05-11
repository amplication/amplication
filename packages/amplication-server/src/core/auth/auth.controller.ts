import {
  Controller,
  UseInterceptors,
  UseGuards,
  Get,
  Res,
  Req,
  UseFilters, Logger, Inject
} from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService, AuthUser } from './auth.service';
import { GithubAuthExceptionFilter } from 'src/filters/github-auth-exception.filter';
import {WINSTON_MODULE_PROVIDER} from "nest-winston";

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService,
              @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

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
    const user:AuthUser = request.user as AuthUser;
    this.logger.log({
      level: 'info',
      message: `receive login callback from github account_id=${user.account.id}`,
    })
    const token = await this.authService.prepareToken(user);
    console.dir(
      request.headers
    );
    response.redirect(301, `${request.headers.referer}?token=${token}`);
  }
}
