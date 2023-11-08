import { Module, Global } from "@nestjs/common";
import Redis from "ioredis";
import { RedisService } from "./redis.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Env } from "../env";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: "REDIS_CLIENT",
      useFactory: (configService: ConfigService) => {
        const redis = new Redis({
          host: configService.get<string>(Env.REDIS_HOST),
          port: configService.get<number>(Env.REDIS_PORT),
          username: configService.get<string>(Env.REDIS_USERNAME),
          password: configService.get<string>(Env.REDIS_PASSWORD),
        });
        return redis;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule {}
