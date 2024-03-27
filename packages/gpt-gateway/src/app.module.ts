import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { ModelModule } from "./model/model.module";
import { ConversationTypeModule } from "./conversationType/conversationType.module";
import { TemplateModule } from "./template/template.module";
import { MessageModule } from "./message/message.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { KafkaModule } from "./kafka/kafka.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

import { ACLModule } from "./auth/acl.module";
import { AuthModule } from "./auth/auth.module";
import { AmplicationLoggerModule } from "@amplication/util/nestjs/logging";
import { join } from "path";
import { TracingModule } from "@amplication/util/nestjs/tracing";
import { SERVICE_NAME } from "./constants";

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
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    AmplicationLoggerModule.forRoot({
      component: SERVICE_NAME,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        return {
          autoSchemaFile:
            configService.get("GRAPHQL_SCHEMA_DEST") ||
            join(process.cwd(), "src", "schema.graphql"),
          sortSchema: true,
          debug: configService.get("GRAPHQL_DEBUG") === "1",
          playground: configService.get("GRAPHQL_PLAYGROUND_ENABLED") === "1",
          introspection:
            configService.get("GRAPHQL_INTROSPECTION_ENABLED") === "1",
          context: ({ req }: { req: Request }) => ({
            req,
          }),
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
    TracingModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {}
