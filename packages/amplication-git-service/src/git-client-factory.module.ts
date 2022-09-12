import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {GithubFactory} from "./providers/github.factory";

@Global()
@Module({
  imports: [
    ConfigModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env']
    })
  ],
  providers: [GithubFactory],
  exports: [GithubFactory]
})
export class GitClientFactoryModule {}
