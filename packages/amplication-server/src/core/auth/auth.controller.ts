import https from 'https';
import { Controller, Post, Req, Res, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { MorganInterceptor } from 'nest-morgan';
import { GitHubStrategyConfigService } from './githubStrategyConfig.service';

const CLIENT_SECRET_KEY = 'client_secret';

@Controller('/')
@UseInterceptors(MorganInterceptor('combined'))
export class AuthController {
  constructor(
    private readonly githubConfigService: GitHubStrategyConfigService
  ) {}
  /** @see: https://docs.github.com/en/developers/apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github */
  @Post('/github/login/oauth/access_token')
  async createAccessToken(@Req() request: Request, @Res() response: Response) {
    const options = await this.githubConfigService.getOptions();
    const params = new URLSearchParams(request.body);
    params.append(CLIENT_SECRET_KEY, options.clientSecret);
    const newRequest = https.request(
      {
        href: 'https://github.com/login/oauth/access_token',
        headers: request.headers
      },
      newResponse => {
        newResponse.pipe(response);
        newResponse.on('end', () => {
          response.status(newResponse.statusCode).end();
        });
      }
    );
    newRequest.write(params.toString());
    newRequest.end();
  }
}
