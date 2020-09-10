import {
  Controller,
  UseInterceptors,
  UseGuards,
  Get,
  Res
} from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { AuthService, AuthUser } from './auth.service';
import { UserEntity } from 'src/decorators/user.decorator';

@Controller('/')
@UseInterceptors(MorganInterceptor('combined'))
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async github() {
    return;
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(
    @UserEntity() user: AuthUser,
    @Res() response: Response
  ) {
    const token = this.authService.prepareToken(user);
    response.redirect(301, `/?token=${token}`);
  }
}
