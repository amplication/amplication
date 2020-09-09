import axios from 'axios';
import {
  Controller,
  Post,
  Req,
  Res,
  UseInterceptors,
  NotFoundException
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MorganInterceptor } from 'nest-morgan';
import { GitHubStrategyConfigService } from './githubStrategyConfig.service';

const CLIENT_SECRET_KEY = 'client_secret';
const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';

@Controller('/')
@UseInterceptors(MorganInterceptor('combined'))
export class AuthController {
  constructor(
    private readonly githubConfigService: GitHubStrategyConfigService
  ) {}
  /**
   * Proxies a request to GitHub to create an access token from given code and
   * client ID. Adds the client secret which is only known for the server.
   * @returns access token to GitHub
   * @see: https://docs.github.com/en/developers/apps/authorizing-oauth-apps#2-users-are-redirected-back-to-your-site-by-github
   */
  @Post('/github/login/oauth/access_token')
  async createAccessToken(@Req() request: Request, @Res() response: Response) {
    const options = await this.githubConfigService.getOptions();
    if (!options) {
      throw new NotFoundException();
    }
    const params = new URLSearchParams(request.body);
    params.append(CLIENT_SECRET_KEY, options.clientSecret);
    // Make a request to GitHub to receive the access token
    const githubResponse = await axios.post(GITHUB_ACCESS_TOKEN_URL, {
      // Directly use the request headers
      headers: request.headers,
      data: params.toString()
    });
    response.status(githubResponse.status);
    response.header(githubResponse.headers);
    response.send(githubResponse.data);
    response.end();
  }
}
