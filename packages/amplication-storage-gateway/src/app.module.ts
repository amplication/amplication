import { Module, Scope } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MorganInterceptor, MorganModule } from "nest-morgan";
import { HealthModule } from "./health/health.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { GraphQLModule } from "@nestjs/graphql";
import { StorageModule } from "./storage/storage.module";

@Module({
  controllers: [],
  imports: [
    HealthModule,
    StorageModule,
    SecretsManagerModule,
    MorganModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env", ".env.local"],
    }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    // GraphQLModule.forRootAsync({
    //   useFactory: (configService) => {
    //     const playground = configService.get("GRAPHQL_PLAYGROUND");
    //     const introspection = configService.get("GRAPHQL_INTROSPECTION");
    //     return {
    //       autoSchemaFile: "schema.graphql",
    //       sortSchema: true,
    //       playground,
    //       introspection: playground || introspection,
    //     };
    //   },
    //   inject: [ConfigService],
    //   imports: [ConfigModule],
    // }),
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
