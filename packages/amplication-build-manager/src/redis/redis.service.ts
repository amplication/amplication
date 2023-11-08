import { Inject, Injectable } from "@nestjs/common";
import Redis from "ioredis";
import { BuildId, RedisValue, EnumDomainName, EnumEventStatus } from "../types";

@Injectable()
export class RedisService {
  constructor(@Inject("REDIS_CLIENT") private readonly redisClient: Redis) {}

  async setServerJobInProgress(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.Server}`]: EnumEventStatus.InProgress,
    };

    return this.set(key, value);
  }

  async setAdminUIJobInProgress(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.AdminUI}`]: EnumEventStatus.InProgress,
    };

    return this.set(key, value);
  }

  async setServerJobSuccess(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.Server}`]: EnumEventStatus.Success,
    };

    return this.set(key, value);
  }

  async setAdminUIJobSuccess(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.AdminUI}`]: EnumEventStatus.Success,
    };

    return this.set(key, value);
  }

  async setServerJobFailure(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.Server}`]: EnumEventStatus.Failure,
    };

    return this.set(key, value);
  }

  async setAdminUIJobFailure(key: BuildId): Promise<string | null> {
    const value = {
      [`${key}-${EnumDomainName.AdminUI}`]: EnumEventStatus.Failure,
    };

    return this.set(key, value);
  }

  async getJobStatus(key: BuildId): Promise<EnumEventStatus> {
    const value = await this.get(key);
    const hasServerAndAdmin =
      value.hasOwnProperty(`${key}-${EnumDomainName.Server}`) &&
      value.hasOwnProperty(`${key}-${EnumDomainName.AdminUI}`);

    const hasOnlyServer =
      value.hasOwnProperty(`${key}-${EnumDomainName.Server}`) &&
      !value.hasOwnProperty(`${key}-${EnumDomainName.AdminUI}`);

    const hasOnlyAdmin =
      !value.hasOwnProperty(`${key}-${EnumDomainName.Server}`) &&
      value.hasOwnProperty(`${key}-${EnumDomainName.AdminUI}`);

    if (hasServerAndAdmin) {
      const serverStatus = value[`${key}-${EnumDomainName.Server}`];
      const adminUIStatus = value[`${key}-${EnumDomainName.AdminUI}`];

      if (
        serverStatus === EnumEventStatus.Success &&
        adminUIStatus === EnumEventStatus.Success
      ) {
        return EnumEventStatus.Success;
      } else if (
        serverStatus === EnumEventStatus.Failure ||
        adminUIStatus === EnumEventStatus.Failure
      ) {
        return EnumEventStatus.Failure;
      }
    }

    if (hasOnlyServer) {
      return value[`${key}-${EnumDomainName.Server}`];
    }

    if (hasOnlyAdmin) {
      return value[`${key}-${EnumDomainName.AdminUI}`];
    }
  }

  private async get(key: BuildId): Promise<RedisValue | null> {
    const value = await this.redisClient.get(key);
    return this.deserializeValue(value);
  }

  private async set(
    key: BuildId,
    value: RedisValue,
    ttl?: number
  ): Promise<string | null> {
    this.validateRedisValue(key, value);
    const serializedValue = this.serializeValue(value);
    return ttl
      ? this.redisClient.set(key, serializedValue, "EX", ttl)
      : this.redisClient.set(key, serializedValue);
  }

  private serializeValue(value: RedisValue): string {
    return JSON.stringify(value);
  }

  private deserializeValue(value: string): RedisValue {
    return JSON.parse(value);
  }

  private validateRedisValue(buildId: BuildId, value: RedisValue): void {
    for (const [recordKey, recordValue] of Object.entries(value)) {
      const domainPart = recordKey.substring(buildId.length + 1);

      if (!(domainPart in EnumDomainName)) {
        throw new Error(`Invalid domain type in key: ${recordKey}`);
      }

      if (!Object.values(EnumEventStatus).includes(recordValue)) {
        throw new Error(`Invalid event status in value for key: ${recordKey}`);
      }
    }
  }
}
