import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GitModule } from "./git/git.module";


@Global()
@Module({
  imports: [
    GitModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
  ],
})
export class AppModule {}
