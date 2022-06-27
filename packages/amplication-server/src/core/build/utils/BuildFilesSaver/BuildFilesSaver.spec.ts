import { mock } from 'jest-mock-extended';
import { BuildFilesSaver } from './BuildFilesSaver';
import { ConfigService } from '@nestjs/config';
import fsExtra from 'fs-extra';
import { tmpdir } from 'os';
import { join } from 'path';

const logger = {
  debug: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  format: Symbol('EXAMPLE_LOGGER_FORMAT')
};

const RESOURCE_ID_MOCK = 'resourceId';
const BUILD_ID_MOCK = 'buildId';
describe('Testing the BuildFilesSaver service', () => {
  const outputFileSpy = jest.spyOn(fsExtra, 'outputFile');

  let buildFilesSaver: BuildFilesSaver;
  const configService = mock<ConfigService>();

  const relativePath = join(RESOURCE_ID_MOCK, BUILD_ID_MOCK);
  beforeEach(() => {
    configService.get.mockClear();
    configService.get.mockReturnValue(tmpdir());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    buildFilesSaver = new BuildFilesSaver(configService, logger);
  });
  it('should save an resource files to a build folder', async () => {
    await buildFilesSaver.saveFiles(relativePath, [
      {
        code: 'code',
        path: 'index.ts'
      }
    ]);
    expect(outputFileSpy).toBeCalledWith(
      join(tmpdir(), relativePath, 'index.ts'),
      'code'
    );
    expect(outputFileSpy).toBeCalledTimes(1);
  });
});
