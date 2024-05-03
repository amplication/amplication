import { Test, TestingModule } from "@nestjs/testing";
import { RedisService } from "./redis.service";
import { ConfigService } from "@nestjs/config";
import Redis from "ioredis";

jest.mock("ioredis");

const testKey = "testKey";

describe("RedisService", () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === "REDIS_HOST") return "localhost";
              if (key === "REDIS_PORT") return 6379;
              if (key === "REDIS_USERNAME") return "user";
              if (key === "REDIS_PASSWORD") return "pass";
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it.each([
    {
      a: "a",
    },
    "dog",
    1,
    null,
  ])("should get the expected value %s", async (expectedValue) => {
    const spyOnGet = jest
      .spyOn(Redis.prototype, "get")
      .mockResolvedValue(JSON.stringify(expectedValue));

    const value = await service.get<typeof expectedValue>(testKey);
    expect(spyOnGet).toBeCalledWith(testKey);
    expect(value).toEqual(expectedValue);
  });

  it.each([
    {
      a: "a",
    },
    "dog",
    1,
    null,
  ])("should set expected value %s", async () => {
    const value = "testValue";
    const spyOnSet = jest.spyOn(Redis.prototype, "set").mockResolvedValue("OK");

    await service.set(testKey, value);
    expect(spyOnSet).toBeCalledWith(testKey, JSON.stringify(value));
  });
});
