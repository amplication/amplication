import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { StorageModule } from "./storage/storage.module";
import {
  ControllerInjector,
  GuardInjector,
} from "@amplication/opentelemetry-nestjs";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { Module, Scope } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static";
import { MorganInterceptor, MorganModule } from "nest-morgan";

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
    TracingModule.forRoot({
      serviceName: "amplication-storage-gateway",
      traceAutoInjectors: [ControllerInjector, GuardInjector],
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
