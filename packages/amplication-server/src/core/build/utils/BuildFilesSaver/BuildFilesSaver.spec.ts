import { mock } from 'jest-mock-extended';
import { BuildFilesSaver } from './BuildFilesSaver';
import { ConfigService } from '@nestjs/config';
import fsExtra from 'fs-extra';
import { tmpdir } from 'os';

const APP_ID_MOCK = 'appId';
const BUILD_ID_MOCK = 'buildId';
describe('Testing the BuildFilesSaver service', () => {
  const outputFileSpy = jest.spyOn(fsExtra, 'outputFile');

  let buildFilesSaver: BuildFilesSaver;
  const configService = mock<ConfigService>();
  const relativePath = `${APP_ID_MOCK}/${BUILD_ID_MOCK}`;
  beforeEach(() => {
    buildFilesSaver = new BuildFilesSaver(configService);
    configService.get.mockClear();
  });
  it('should save an app files to a build folder', async () => {
    await buildFilesSaver.saveFiles(relativePath, [
      {
        code: 'code',
        path: 'index.ts'
      }
    ]);
    expect(outputFileSpy).toBeCalledWith(
      `${tmpdir()}/builds/${relativePath}/index.ts`,
      'code'
    );
    expect(outputFileSpy).toBeCalledTimes(1);
  });
});
