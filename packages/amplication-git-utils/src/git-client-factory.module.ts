import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GithubFactory } from "./git/github.factory";
import { GithubConfig } from "./utils/github-config.dto";
import {
  GITHUB_APP_APP_ID_VAR,
  GITHUB_APP_PRIVATE_KEY_VAR,
} from "./git/github.service";

@Global()
@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
  ],
  providers: [
    {
      provide: GithubConfig,
      useFactory: (configService: ConfigService) => {
        const appId = configService.get(GITHUB_APP_APP_ID_VAR);
        const privateKey = configService
          .get(GITHUB_APP_PRIVATE_KEY_VAR)
          .replace(/\\n/g, "\n");
        return new GithubConfig(appId, privateKey);
      },
    },
    GithubFactory,
  ],
  exports: [GithubFactory],
})
export class GitClientFactoryModule {}
