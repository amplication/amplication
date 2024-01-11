import { SERVICE_NAME } from "./constants";
import { HealthModule } from "./health/health.module";
import { PluginModule } from "./plugin/plugin.module";
import { PluginVersionModule } from "./pluginVersion/pluginVersion.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ServeStaticModule } from "@nestjs/serve-static";
@Module({
  controllers: [],
  imports: [
    PrismaModule,
    PluginModule,
    forwardRef(() => PluginVersionModule),
    HealthModule,
    SecretsManagerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    AmplicationLoggerModule.forRoot({
      component: SERVICE_NAME,
    }),
    TracingModule.forRoot({
      serviceName: SERVICE_NAME,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService) => {
        const playground = configService.get("GRAPHQL_PLAYGROUND");
        const introspection = configService.get("GRAPHQL_INTROSPECTION");
        return {
          autoSchemaFile: "schema.graphql",
          sortSchema: true,
          playground,
          introspection: playground || introspection,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
})
export class AppModule {}
