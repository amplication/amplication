import { Strategy, StrategyOptions, Profile } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Provider, Abstract, Type } from '@nestjs/common/interfaces';
import { AuthService, AuthUser } from './auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  static forRootAsync(
    optionsFactoryProvider:
      | Type<any>
      | string
      | symbol
      | Abstract<any>
      | Function
  ): Provider {
    return {
      provide: 'GitHubStrategy',
      useClass: GitHubStrategy,
      inject: [AuthService, optionsFactoryProvider]
    };
  }

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
        githubId: profile.id
      }
    });
    if (!user) {
      return this.authService.createGitHubUser(profile);
    }
    return user;
  }
}
