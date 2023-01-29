import { AmplicationLoggerModule } from "@amplication/nest-logger-module";
import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SERVICE_NAME } from "./git/git.constants";

@Global()
@Module({
  imports: [
    AmplicationLoggerModule.register({
      metadata: { service: SERVICE_NAME },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
  ],
})
export class AppModule {}
