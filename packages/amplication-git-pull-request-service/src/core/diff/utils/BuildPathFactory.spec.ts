import { BuildPathFactory } from './BuildPathFactory';
import { ConfigService } from '@nestjs/config';
import { mock } from 'jest-mock-extended';
import { join } from 'path';

const rootEnvPath = '/users';
const appId = 'appId';
const buildId = 'buildId';

describe('Testing the BuildPathFactory', () => {
  let buildPathFactory;
  beforeEach(() => {
    const configService = mock<ConfigService>();
    configService.get.mockReturnValue(rootEnvPath);
    buildPathFactory = new BuildPathFactory(configService);
  });
  it('should combine the root folder that get form the env, the folder with appId and the new buildId', () => {
    const path = buildPathFactory.get(appId, buildId);
    expect(path).toBe(join(rootEnvPath, appId, buildId));
  });
});
