import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, StrategyOptions } from "passport-github2";
import { AuthService } from "./auth.service";
import { getEmail } from "./github.util";
import { AuthUser } from "./types";

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
    profile: Profile,
    done: (err: any, user: AuthUser, info: any) => void
  ): Promise<void> {
    const email = await getEmail(accessToken);
    const user = await this.authService.getAuthUser({
      account: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR: [{ githubId: profile.id }, { email: email }],
      },
    });
    if (!user) {
      return done(
        null,
        await this.authService.createGitHubUser(profile, email),
        {
          isNew: true,
        }
      );
    }
    if (!user.account.githubId || user.account.githubId !== profile.id) {
      return done(
        null,
        await this.authService.updateGitHubUser(user, profile),
        {
          isNew: false,
        }
      );
    }
    return done(null, user, { isNew: false });
  }
}
