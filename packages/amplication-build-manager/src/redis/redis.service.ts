import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";
@Injectable()
export class RedisService {
  private redisClient: Redis;
  constructor(private readonly configService: ConfigService) {
    this.redisClient = new Redis({
      host: this.configService.get<string>("REDIS_HOST"),
      port: this.configService.get<number>("REDIS_PORT"),
      username: this.configService.get<string>("REDIS_USERNAME"),
      password: this.configService.get<string>("REDIS_PASSWORD"),
    });
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
