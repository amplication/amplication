import { Module, Scope } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { MorganInterceptor, MorganModule } from "nest-morgan";
import { UserModule } from "./user/user.module";
import { ModelModule } from "./model/model.module";
import { ConversationTypeModule } from "./conversationType/conversationType.module";
import { TemplateModule } from "./template/template.module";
import { MessageModule } from "./message/message.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { KafkaModule } from "./kafka/kafka.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { ACLModule } from "./auth/acl.module";
import { AuthModule } from "./auth/auth.module";
import { join } from "path";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";

@Module({
  controllers: [],
  imports: [
    KafkaModule,
    ACLModule,
    AuthModule,
    UserModule,
    ModelModule,
    ConversationTypeModule,
    TemplateModule,
    MessageModule,
    HealthModule,
    PrismaModule,
    SecretsManagerModule,
    MorganModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    AmplicationLoggerModule.forRoot({
      component: "gpt-gateway",
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
