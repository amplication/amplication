import { Test } from "@nestjs/testing";
import { Response } from "express";
import { AuthController } from "./auth.controller";
import { GitHubRequest } from "./types";
import { ModuleMocker, MockFunctionMetadata } from "jest-mock";
import { AuthService } from "..";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

const moduleMocker = new ModuleMocker(global);

describe("AuthController", () => {
  let authController: AuthController;
  const mockServiceConfigureJtw = jest.fn();
  const expectedDomain = "amplication.com";

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AmplicationLogger,
          useClass: jest.fn(() => ({
            info: jest.fn(),
            error: jest.fn(),
          })),
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: (param) => {
              if (param === Env.CLIENT_HOST) {
                return `https://server.${expectedDomain}`;
              } else return "some-value";
            },
          })),
        },
        {
          provide: AuthService,
          useClass: jest.fn(() => ({
            configureJtw: mockServiceConfigureJtw,
          })),
        },
      ],
    })
      .useMocker((token) => {
        const mockMetadata = moduleMocker.getMetadata(
          token
        ) as MockFunctionMetadata<any, any>;
        return moduleMocker.generateFromMetadata(mockMetadata);
      })
      .compile();

    authController = moduleRef.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("githubCallback should return a redirect 301 setting a token in a temporary AJWT cookie by calling configureJtw", async () => {
    const fakeRequest = {
      user: {
        account: {
          id: "test",
        },
      },
      isNew: false,
    } as unknown as GitHubRequest;

    const responseMock = {
      status: jest.fn((x) => responseMock),
      cookie: jest.fn(),
      redirect: jest.fn(),
    } as unknown as Response;

    await authController.githubCallback(fakeRequest, responseMock);

    expect(mockServiceConfigureJtw).toHaveBeenCalledWith(
      responseMock,
      fakeRequest.user,
      fakeRequest.isNew
    );
  });
});
