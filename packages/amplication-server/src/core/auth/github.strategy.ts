import { Strategy, StrategyOptions, Profile } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService, AuthUser } from './auth.service';

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
    const user = await this.authService.getAuthUser({
      account: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR: [{ githubId: profile.id }, { email: profile.emails[0].value }]
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
