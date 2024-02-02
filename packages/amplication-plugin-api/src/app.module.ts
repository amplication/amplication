import { forwardRef, Module } from "@nestjs/common";
import { PluginModule } from "./plugin/plugin.module";
import { PluginVersionModule } from "./pluginVersion/pluginVersion.module";
import { CategoryModule } from "./category/category.module";
import { HealthModule } from "./health/health.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { PrismaModule } from "./prisma/prisma.module";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { SERVICE_NAME } from "./constants";
@Module({
  controllers: [],
  imports: [
    PrismaModule,
    PluginModule,
    forwardRef(() => PluginVersionModule),
    CategoryModule,
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
