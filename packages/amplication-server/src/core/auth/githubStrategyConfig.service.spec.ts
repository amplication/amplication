import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';
import {
  GitHubStrategyConfigService,
  GITHUB_CLIENT_ID_VAR,
  GITHUB_CLIENT_SECRET_VAR,
  GITHUB_REDIRECT_URI_VAR,
  GITHUB_SCOPE_VAR,
  GITHUB_SECRET_SECRET_NAME_VAR
} from './githubStrategyConfig.service';

const EXAMPLE_GITHUB_CLIENT_ID = 'EXAMPLE_GITHUB_CLIENT_ID';
const EXAMPLE_GITHUB_CLIENT_SECRET = 'EXAMPLE_GITHUB_CLIENT_SECRET';
const EXAMPLE_GITHUB_SECRET_SECRET_NAME = 'EXAMPLE_GITHUB_SECRET_SECRET_NAME';
const EXAMPLE_GITHUB_REDIRECT_URI = 'EXAMPLE_GITHUB_REDIRECT_URI';
const EXAMPLE_GITHUB_SCOPE = 'EXAMPLE_GITHUB_SCOPE';

const configServiceGet = jest.fn();
const googleSecretManagerServiceAccessSecretVersion = jest.fn();

describe('GitHubStrategyConfigService', () => {
  let service: GitHubStrategyConfigService;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: configServiceGet
          }
        },
        {
          provide: GoogleSecretsManagerService,
          useValue: {
            accessSecretVersion: googleSecretManagerServiceAccessSecretVersion
          }
        },
        GitHubStrategyConfigService
      ]
    }).compile();

    service = module.get<GitHubStrategyConfigService>(
      GitHubStrategyConfigService
    );
  });
  test('it returns null if client ID is not defined', async () => {
    expect(await service.getOptions()).toEqual(null);
  });
  test('it returns config if client ID and client secret are defined', async () => {
    configServiceGet.mockImplementation(name => {
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
      scope: EXAMPLE_GITHUB_SCOPE
    });
  });
  test('it returns config if client ID and client secret name are defined', async () => {
    configServiceGet.mockImplementation(name => {
      switch (name) {
        case GITHUB_CLIENT_ID_VAR: {
          return EXAMPLE_GITHUB_CLIENT_ID;
        }
        case GITHUB_SECRET_SECRET_NAME_VAR: {
          return EXAMPLE_GITHUB_SECRET_SECRET_NAME;
        }
        case GITHUB_REDIRECT_URI_VAR: {
          return EXAMPLE_GITHUB_REDIRECT_URI;
        }
        case GITHUB_SCOPE_VAR: {
          return EXAMPLE_GITHUB_SCOPE;
        }
      }
    });
    googleSecretManagerServiceAccessSecretVersion.mockImplementation(() => [
      {
        payload: {
          data: EXAMPLE_GITHUB_CLIENT_SECRET
        }
      }
    ]);
    expect(await service.getOptions()).toEqual({
      clientID: EXAMPLE_GITHUB_CLIENT_ID,
      clientSecret: EXAMPLE_GITHUB_CLIENT_SECRET,
      callbackURL: EXAMPLE_GITHUB_REDIRECT_URI,
      scope: EXAMPLE_GITHUB_SCOPE
    });
  });
});
