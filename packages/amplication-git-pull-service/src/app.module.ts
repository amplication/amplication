import { Module } from "@nestjs/common";
import { GitRepositoryPullModule } from "./gitRepositoryPull/gitRepositoryPull.module";
import { HealthModule } from "./health/health.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { MorganModule } from "nest-morgan";
import { ConfigModule } from "@nestjs/config";

@Module({
  controllers: [],
  imports: [
    GitRepositoryPullModule,
    HealthModule,
    SecretsManagerModule,
    MorganModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  providers: [],
})
export class AppModule {}
