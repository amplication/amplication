import { GqlCronGuard } from "./gql-cron.guard";
import { ConfigService } from "@nestjs/config";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { Env } from "../env";
import { GqlExecutionContext } from "@nestjs/graphql";

// Mocking the entire @nestjs/graphql module
jest.mock("@nestjs/graphql", () => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  GqlExecutionContext: {
    create: jest.fn(),
  },
}));

const mockGqlContext = (secretKey: string) => ({
  // eslint-disable-next-line @typescript-eslint/naming-convention
  req: { headers: { "x-cron-secret": secretKey } },
});

const mockedExecutionContext = (secretKey: string): ExecutionContext => {
  const context = {
    switchToHttp: () => ({
      // eslint-disable-next-line @typescript-eslint/naming-convention
      getRequest: () => ({ headers: { "x-cron-secret": secretKey } }),
    }),
    getType: () => "graphql",
  };

  return context as unknown as ExecutionContext;
};

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
    const validSecretKey = "open-sesame";
    const mockContext = mockGqlContext(validSecretKey);
    GqlExecutionContext.create = jest
      .fn()
      .mockReturnValue({ getContext: () => mockContext });

    expect(guard.canActivate(mockedExecutionContext(validSecretKey))).toBe(
      true
    );
  });

  it("should throw UnauthorizedException for an invalid secret key", () => {
    const invalidSecretKey = "imposter";
    const mockContext = mockGqlContext(invalidSecretKey);
    GqlExecutionContext.create = jest
      .fn()
      .mockReturnValue({ getContext: () => mockContext });

    expect(() =>
      guard.canActivate(mockedExecutionContext(invalidSecretKey))
    ).toThrow(UnauthorizedException);
  });

  it("should throw UnauthorizedException when the secret key is undefined", () => {
    const mockContext = mockGqlContext(undefined);
    GqlExecutionContext.create = jest
      .fn()
      .mockReturnValue({ getContext: () => mockContext });

    expect(() => guard.canActivate(mockedExecutionContext(undefined))).toThrow(
      UnauthorizedException
    );
  });
});
