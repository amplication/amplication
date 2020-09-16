import axios from 'axios';
import { Strategy, StrategyOptions, Profile } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService, AuthUser } from './auth.service';

/** @todo use github client */
async function getEmail(accessToken: string): Promise<string> {
  const response = await axios.get('https://api.github.com/user/emails', {
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Accept: 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Authorization: `token ${accessToken}`
    }
  });
  const [{ email }] = response.data;
  return email;
}

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    options: StrategyOptions
  ) {
    super(options);
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile
  ): Promise<AuthUser> {
    const email = await getEmail(accessToken);
    const user = await this.authService.getAuthUser({
      account: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR: [{ githubId: profile.id }, { email: email }]
      }
    });
    if (!user) {
      return this.authService.createGitHubUser(profile);
    }
    if (!user.account.githubId) {
      return this.authService.updateGitHubUser(user, profile);
    }
    return user;
  }
}
