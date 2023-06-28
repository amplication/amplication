import { Test, TestingModule } from "@nestjs/testing";
import { ExtractJwt } from "passport-jwt";
import jsonwebtoken from "jsonwebtoken";

import { CodeAccessGuard } from "./codeAccessGuard.guard";
import { QueueService } from "../queue/queue.service";
import { ExecutionContext } from "@nestjs/common";

const MOCK_USER = {
  userId: "123",
};

jest.mock("passport-jwt", () => {
  return {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    ExtractJwt: {
      fromAuthHeaderAsBearerToken: () =>
        jest.fn((request) => request.headers?.authorization?.split(" ")[1]),
    },
  };
});
jest.mock("jsonwebtoken", () => ({
  decode: jest.fn((token) => (token === "isValidToken" ? MOCK_USER : null)),
}));

const spyOnFromAuthHeaderAsBearerToken = jest.spyOn(
  ExtractJwt,
  "fromAuthHeaderAsBearerToken"
);
const spyOnDecode = jest.spyOn(jsonwebtoken, "decode");

describe("CodeAccessGuard", () => {
  let guard: CodeAccessGuard;
  let queueService: QueueService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: QueueService,
          useClass: jest.fn(() => ({
            canAccessBuild: jest.fn().mockResolvedValue(true),
          })),
        },
        CodeAccessGuard,
      ],
    }).compile();

    guard = module.get<CodeAccessGuard>(CodeAccessGuard);
    queueService = module.get<QueueService>(QueueService);
  });

  it("should be defined", () => {
    expect(guard).toBeDefined();
  });

  it("should return `false` for no `authorization` headers present", async () => {
    const context = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: undefined,
          },
        }),
      })),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toEqual(false);
    expect(context.switchToHttp).toHaveBeenCalled();
    expect(spyOnFromAuthHeaderAsBearerToken).toHaveBeenCalled();
  });

  it("should return `false` if no `Bearer token` is provided", async () => {
    const context = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: "Bearer ",
          },
        }),
      })),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toEqual(false);
    expect(context.switchToHttp).toHaveBeenCalled();
    expect(spyOnFromAuthHeaderAsBearerToken).toHaveBeenCalled();
  });

  it("should return `false` if the decoded payload is incorrect (has no data associated)", async () => {
    const context = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: "Bearer notValidToken",
          },
        }),
      })),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toEqual(false);
    expect(context.switchToHttp).toHaveBeenCalled();
    expect(spyOnFromAuthHeaderAsBearerToken).toHaveBeenCalled();
    expect(spyOnDecode).toHaveBeenCalledWith("notValidToken");
    expect(spyOnDecode).toReturnWith(null);
  });

  it("should return `true` if valid token is provided and correct `buildId` is provided", async () => {
    const buildId = "buildId";
    const context = {
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn().mockReturnValue({
          headers: {
            authorization: "Bearer isValidToken",
          },
          params: {
            buildId: "buildId",
          },
        }),
      })),
    } as unknown as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toEqual(true);
    expect(context.switchToHttp).toHaveBeenCalled();
    expect(spyOnFromAuthHeaderAsBearerToken).toHaveBeenCalled();
    expect(spyOnDecode).toHaveBeenCalledWith("isValidToken");
    expect(spyOnDecode).toReturnWith(MOCK_USER);
    expect(queueService.canAccessBuild).toBeCalledWith(
      MOCK_USER.userId,
      buildId
    );
    await expect(
      queueService.canAccessBuild(MOCK_USER.userId, buildId)
    ).resolves.toEqual(true);
  });
});
