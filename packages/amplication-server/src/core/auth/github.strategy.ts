import { Strategy, StrategyOptions, Profile } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService, AuthUser } from './auth.service';
import { getEmail } from './github.util';

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
      const newUser = await this.authService.createGitHubUser(profile, email);
      newUser.isNewUser = true;
      return newUser;
    }
    if (!user.account.githubId) {
      user.isNewUser = false;
      return this.authService.updateGitHubUser(user, profile);
    }
    user.isNewUser = false;
    return user;
  }
}
