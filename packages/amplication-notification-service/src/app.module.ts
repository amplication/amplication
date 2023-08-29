import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./health/health.module";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { Env } from "./env";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { NovuService } from "./util/novuService";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    AmplicationLoggerModule.forRoot({
      component: Env.SERVICE_NAME,
    }),
    TracingModule.forRoot({
      serviceName: Env.SERVICE_NAME,
    }),
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, NovuService],
})
export class AppModule {}
