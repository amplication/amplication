import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis, { RedisOptions } from "ioredis";
import { Env } from "../env";
@Injectable()
export class RedisService {
  private redisClient: Redis;
  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>(Env.REDIS_HOST);
    const port = this.configService.get<number>(Env.REDIS_PORT);
    const password = this.configService.get<string>(Env.REDIS_PASSWORD);
    const username = this.configService.get<string>(Env.REDIS_USERNAME);
    const ca = this.configService.get<string>(Env.REDIS_TLS_CA);
    const cert = this.configService.get<string>(Env.REDIS_TLS_CERT);
    const key = this.configService.get<string>(Env.REDIS_TLS_KEY);
    const tls = [ca, cert, key];
    const isTlsEnabled = tls.every((value) => Boolean(value));

    const redisClientConfig: RedisOptions = {
      host,
      port,
      password,
      username,
    };
    if (isTlsEnabled) {
      redisClientConfig.tls = {
        ca,
        cert,
        key,
      };
    }
    this.redisClient = new Redis(redisClientConfig);
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redisClient.get(key);
    return value ? this.deserializeValue<T>(value) : null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<string | null> {
    const serializedValue = this.serializeValue(value);
    return ttl
      ? this.redisClient.set(key, serializedValue, "EX", ttl)
      : this.redisClient.set(key, serializedValue);
  }

  private serializeValue<T>(value: T): string {
    return JSON.stringify(value);
  }

  private deserializeValue<T>(value: string): T {
    return JSON.parse(value);
  }
}
