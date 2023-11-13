import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
import { Env } from "../env";
@Injectable()
export class RedisService {
  private redisClient: Redis;
  constructor(private readonly configService: ConfigService) {
    const redisTlsEnabled = this.configService.get<string>(
      Env.REDIS_TLS_ENABLED // locally set to false //
    );
    const redisClientConfig = {
      host: this.configService.get<string>(Env.REDIS_HOST),
      port: this.configService.get<number>(Env.REDIS_PORT),
      password: this.configService.get<string>(Env.REDIS_PASSWORD),
      username: this.configService.get<string>(Env.REDIS_USERNAME),
    };
    if (!redisTlsEnabled) {
      redisClientConfig["tls"] = {
        ca: this.configService.get<string>(Env.REDIS_TLS_CA),
        cert: this.configService.get<string>(Env.REDIS_TLS_CERT),
        key: this.configService.get<string>(Env.REDIS_TLS_KEY),
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
