import {
  Controller,
  UseInterceptors,
  UseGuards,
  Get,
  Res,
  Req
} from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService, AuthUser } from './auth.service';

@Controller('/')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(MorganInterceptor('combined'))
  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async github() {
    return;
  }

  @UseInterceptors(MorganInterceptor('combined'))
  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() request: Request, @Res() response: Response) {
    const token = await this.authService.prepareToken(request.user as AuthUser);
    response.redirect(301, `/?token=${token}`);
  }
}
