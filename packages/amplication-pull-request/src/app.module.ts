import { Module, OnApplicationShutdown } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { Request } from "express";
import { CoreModule } from "./core";

@Module({
  imports: [
    CoreModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [".env.local", ".env"],
    }),
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        autoSchemaFile:
          configService.get("GRAPHQL_SCHEMA_DEST") || "./src/schema.graphql",
        debug: configService.get("GRAPHQL_DEBUG") === "1",
        playground: configService.get("PLAYGROUND_ENABLE") === "1",
        context: ({ req }: { req: Request }) => ({
          req,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal: string) {
    console.trace(`Application shut down (signal: ${signal})`);
  }
}
