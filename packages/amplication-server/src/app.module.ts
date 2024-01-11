import { SERVICE_NAME } from "./constants";
import { CoreModule } from "./core/core.module";
import { HealthModule } from "./core/health/health.module";
import { AnalyticsSessionIdInterceptor } from "./interceptors/analytics-session-id.interceptor";
import { InjectContextInterceptor } from "./interceptors/inject-context.interceptor";
import { SegmentAnalyticsModule } from "./services/segmentAnalytics/segmentAnalytics.module";
import { SegmentAnalyticsOptionsService } from "./services/segmentAnalytics/segmentAnalyticsOptionsService";
import { SendgridConfigService } from "./services/sendgridConfig.service";
import { Logger } from "@amplication/util/logging";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { GraphQLModule } from "@nestjs/graphql";
import { SendGridModule } from "@ntegral/nestjs-sendgrid";
import { Request } from "express";
import { MorganModule } from "nest-morgan";
import { RequestContextModule } from "nestjs-request-context";
import { join } from "path";

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
