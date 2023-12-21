import { GqlCronGuard } from "./gql-cron.guard";
import { ConfigService } from "@nestjs/config";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Env } from "../env";

const mockedExecutionContext = jest.fn(
  (secretKey: string) =>
    ({
      switchToHttp: () => ({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        getRequest: () => ({ headers: { "x-cron-secret": secretKey } }),
      }),
    } as ExecutionContext)
);

describe("GqlCronGuard", () => {
  let guard: GqlCronGuard;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GqlCronGuard,
        {
          provide: ConfigService,
          useValue: {
            get: (variable) => {
              switch (variable) {
                case Env.CRON_SECRET_KEY:
                  return "open-sesame";
                default:
                  return "";
              }
            },
          },
        },
      ],
    }).compile();

    guard = module.get<GqlCronGuard>(GqlCronGuard);
  });

  it("should return true for a valid secret key", () => {
    expect(guard.canActivate(mockedExecutionContext("open-sesame"))).toBe(true);
  });

  it("should throw UnauthorizedException for an invalid secret key", () => {
    expect(() => guard.canActivate(mockedExecutionContext("imposter"))).toThrow(
      UnauthorizedException
    );
  });
});
