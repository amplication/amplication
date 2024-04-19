import { Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { GraphQLModule as NestJsGraphQLModule } from "@nestjs/graphql";
import { join } from "path";
import { GraphqlSubscriptionPubSubKafkaService } from "./graphqlSubscriptionPubSubKafka.service";

@Module({
  imports: [
    NestJsGraphQLModule.forRootAsync<ApolloDriverConfig>({
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
          context: (context) => {
            if (context?.extra?.request) {
              return {
                req: {
                  ...context?.extra?.request,
                  headers: {
                    ...context?.extra?.request?.headers,
                    ...context?.connectionParams,
                  },
                },
              };
            }
            return { req: context?.req };
          },
          subscriptions: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            "graphql-ws": true,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [GraphqlSubscriptionPubSubKafkaService],
  exports: [GraphqlSubscriptionPubSubKafkaService],
})
export class GraphQLModule implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string) {
    throw new Error("Method not implemented.");
  }
}
