import { Module, OnApplicationShutdown } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule } from "@nestjs/graphql";
import { MorganModule } from "nest-morgan";
import { Request } from "express";
import { CoreModule } from "./core/core.module";
import { InjectContextInterceptor } from "./interceptors/inject-context.interceptor";
import { SegmentAnalyticsModule } from "./services/segmentAnalytics/segmentAnalytics.module";
import { SegmentAnalyticsOptionsService } from "./services/segmentAnalytics/segmentAnalyticsOptionsService";
import { SendGridModule } from "@ntegral/nestjs-sendgrid";
import { SendgridConfigService } from "./services/sendgridConfig.service";
import { HealthModule } from "./core/health/health.module";
import { join } from "path";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { SERVICE_NAME } from "./constants";
import { Logger } from "@amplication/util/logging";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { AnalyticsSessionIdInterceptor } from "./interceptors/analytics-session-id.interceptor";
import { RequestContextModule } from "nestjs-request-context";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    SendGridModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: SendgridConfigService,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: async (configService: ConfigService) => {
        return {
          autoSchemaFile:
            configService.get("GRAPHQL_SCHEMA_DEST") ||
            join(process.cwd(), "src", "schema.graphql"),
          sortSchema: true,
          debug: configService.get("GRAPHQL_DEBUG") === "1",
          playground: configService.get("PLAYGROUND_ENABLE") === "1",
          introspection: configService.get("PLAYGROUND_ENABLE") === "1",
          context: ({ req }: { req: Request }) => ({
            req,
          }),
        };
      },
      inject: [ConfigService],
    }),
    AmplicationLoggerModule.forRoot({
      component: SERVICE_NAME,
    }),
    TracingModule.forRoot({
      serviceName: SERVICE_NAME,
    }),
    MorganModule,
    SegmentAnalyticsModule.registerAsync({
      useClass: SegmentAnalyticsOptionsService,
    }),
    HealthModule,
    CoreModule,
    RequestContextModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: InjectContextInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AnalyticsSessionIdInterceptor,
    },
  ],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string): void {
    new Logger({ component: SERVICE_NAME, isProduction: true }).debug(
      `Application shut down (signal: ${signal})`
    );
  }
}
