import { Strategy } from 'passport-github';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService, AuthUser } from './auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get('GITHUB_CLIENT_ID'),
      clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.get('GITHUB_CALLBACK_URL')
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: { id: string }
  ): Promise<AuthUser> {
    const user = await this.authService.getAuthUser({
      account: {
        githubId: profile.id
      }
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
