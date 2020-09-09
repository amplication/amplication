import {
  Controller,
  UseInterceptors,
  UseGuards,
  Get,
  Req,
  Res
} from '@nestjs/common';
import { MorganInterceptor } from 'nest-morgan';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

@Controller('/')
@UseInterceptors(MorganInterceptor('combined'))
export class AuthController {
  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() request: Request, @Res() response: Response) {
    response.redirect(301, `/?code=${request.query.code}`);
  }
}
