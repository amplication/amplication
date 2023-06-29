import { forwardRef, Module, Scope } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MorganInterceptor, MorganModule } from "nest-morgan";
import { UserModule } from "./user/user.module";
import { PluginModule } from "./plugin/plugin.module";
import { PluginVersionModule } from "./pluginVersion/pluginVersion.module";
import { ACLModule } from "./auth/acl.module";
import { AuthModule } from "./auth/auth.module";
import { HealthModule } from "./health/health.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
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
    UserModule,
    PluginModule,
    forwardRef(() => PluginVersionModule),
    ACLModule,
    AuthModule,
    HealthModule,
    SecretsManagerModule,
    MorganModule,
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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      scope: Scope.REQUEST,
      useClass: MorganInterceptor("combined"),
    },
  ],
})
export class AppModule {}
