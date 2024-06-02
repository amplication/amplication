import { Module, Scope } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MorganInterceptor, MorganModule } from "nest-morgan";
import { HealthModule } from "./health/health.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { StorageModule } from "./storage/storage.module";
import { AuthModule } from "./auth/auth.module";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { SERVICE_NAME } from "./constants";

@Module({
  controllers: [],
  imports: [
    HealthModule,
    StorageModule,
    SecretsManagerModule,
    MorganModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
    }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    TracingModule.forRoot(),
    AmplicationLoggerModule.forRoot({
      component: SERVICE_NAME,
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: MorganInterceptor("combined"),
    },
  ],
})
export class AppModule {}
