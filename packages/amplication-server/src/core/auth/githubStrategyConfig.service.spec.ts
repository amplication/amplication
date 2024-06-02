import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import {
  GitHubStrategyConfigService,
  GITHUB_CLIENT_ID_VAR,
  GITHUB_CLIENT_SECRET_VAR,
  GITHUB_REDIRECT_URI_VAR,
  GITHUB_SCOPE_VAR,
  MISSING_CLIENT_SECRET_ERROR,
} from "./githubStrategyConfig.service";

const EXAMPLE_GITHUB_CLIENT_ID = "EXAMPLE_GITHUB_CLIENT_ID";
const EXAMPLE_GITHUB_CLIENT_SECRET = "EXAMPLE_GITHUB_CLIENT_SECRET";
const EXAMPLE_GITHUB_REDIRECT_URI = "EXAMPLE_GITHUB_REDIRECT_URI";
const EXAMPLE_GITHUB_SCOPE = "EXAMPLE_GITHUB_SCOPE";

const configServiceGetMock = jest.fn();

describe("GitHubStrategyConfigService", () => {
  let service: GitHubStrategyConfigService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: configServiceGetMock,
          },
        },
        GitHubStrategyConfigService,
      ],
    }).compile();

    service = module.get<GitHubStrategyConfigService>(
      GitHubStrategyConfigService
    );

    jest.clearAllMocks();
  });
  test("returns null if client ID is not defined", async () => {
    expect(await service.getOptions()).toEqual(null);
    expect(configServiceGetMock).toBeCalledTimes(1);
  });
  test("returns config if client ID and client secret are defined", async () => {
    configServiceGetMock.mockImplementation((name) => {
      switch (name) {
        case GITHUB_CLIENT_ID_VAR: {
          return EXAMPLE_GITHUB_CLIENT_ID;
        }
        case GITHUB_CLIENT_SECRET_VAR: {
          return EXAMPLE_GITHUB_CLIENT_SECRET;
        }
        case GITHUB_REDIRECT_URI_VAR: {
          return EXAMPLE_GITHUB_REDIRECT_URI;
        }
        case GITHUB_SCOPE_VAR: {
          return EXAMPLE_GITHUB_SCOPE;
        }
      }
    });
    expect(await service.getOptions()).toEqual({
      clientID: EXAMPLE_GITHUB_CLIENT_ID,
      clientSecret: EXAMPLE_GITHUB_CLIENT_SECRET,
      callbackURL: EXAMPLE_GITHUB_REDIRECT_URI,
      scope: EXAMPLE_GITHUB_SCOPE,
    });
    expect(configServiceGetMock).toBeCalledTimes(4);
  });
  test("returns config if client ID and client secret name are defined", async () => {
    configServiceGetMock.mockImplementation((name) => {
      switch (name) {
        case GITHUB_CLIENT_ID_VAR: {
          return EXAMPLE_GITHUB_CLIENT_ID;
        }
        case GITHUB_CLIENT_SECRET_VAR: {
          return EXAMPLE_GITHUB_CLIENT_SECRET;
        }
        case GITHUB_REDIRECT_URI_VAR: {
          return EXAMPLE_GITHUB_REDIRECT_URI;
        }
        case GITHUB_SCOPE_VAR: {
          return EXAMPLE_GITHUB_SCOPE;
        }
      }
    });

    expect(await service.getOptions()).toEqual({
      clientID: EXAMPLE_GITHUB_CLIENT_ID,
      clientSecret: EXAMPLE_GITHUB_CLIENT_SECRET,
      callbackURL: EXAMPLE_GITHUB_REDIRECT_URI,
      scope: EXAMPLE_GITHUB_SCOPE,
    });
    expect(configServiceGetMock).toBeCalledTimes(4);
  });
  test("fails if client ID is defined and client secret is not", async () => {
    configServiceGetMock.mockImplementation((name) => {
      switch (name) {
        case GITHUB_CLIENT_ID_VAR: {
          return EXAMPLE_GITHUB_CLIENT_ID;
        }
        case GITHUB_REDIRECT_URI_VAR: {
          return EXAMPLE_GITHUB_REDIRECT_URI;
        }
        case GITHUB_SCOPE_VAR: {
          return EXAMPLE_GITHUB_SCOPE;
        }
      }
    });
    await expect(service.getOptions()).rejects.toEqual(
      new Error(MISSING_CLIENT_SECRET_ERROR)
    );
    expect(configServiceGetMock).toBeCalledTimes(2);
  });
});
