import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { Env } from "./env";
import { HealthModule } from "./health/health.module";
import { NovuService } from "./util/novuService";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

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
