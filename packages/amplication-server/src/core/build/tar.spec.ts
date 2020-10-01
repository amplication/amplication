import { Buffer } from 'buffer';
import tar from 'tar-stream';
import zlib from 'zlib';
import getStream from 'get-stream';
import { createTarGzFileFromModules } from './tar';

jest.mock('tar');
const tarPackEntryEndMock = jest.fn();
const tarPackEntryMock = jest.fn(() => ({
  end: tarPackEntryEndMock
}));
const tarPackFinalizeMock = jest.fn();
const tarPackPipeMock = jest.fn(function() {
  return this;
});
const MOCK_PACK = {
  entry: tarPackEntryMock,
  finalize: tarPackFinalizeMock,
  pipe: tarPackPipeMock
};
// eslint-disable-next-line
// @ts-ignore
tar.pack = jest.fn(() => MOCK_PACK);

const EXAMPLE_BUFFER = Buffer.from([]);

jest.mock('get-stream');
// eslint-disable-next-line
// @ts-ignore
getStream.buffer.mockImplementation(() => Promise.resolve(EXAMPLE_BUFFER));

const EXAMPLE_GZIP = {};

jest.mock('zlib');
// eslint-disable-next-line
// @ts-ignore
zlib.createGzip.mockImplementation(() => EXAMPLE_GZIP);

const EXAMPLE_PATH = 'EXAMPLE_PATH';
const EXAMPLE_CODE = 'EXAMPLE_CODE';

describe('createTarFileFromModules', () => {
  test('it creates a tar file', async () => {
    const modules = [
      {
        path: EXAMPLE_PATH,
        code: EXAMPLE_CODE
      }
    ];
    await expect(createTarGzFileFromModules(modules)).resolves.toBe(
      EXAMPLE_BUFFER
    );
    expect(tar.pack).toBeCalledTimes(1);
    expect(tar.pack).toBeCalledWith();
    expect(tarPackEntryEndMock).toBeCalledTimes(1);
    expect(tarPackEntryEndMock).toBeCalledWith();
    expect(tarPackFinalizeMock).toBeCalledTimes(1);
    expect(tarPackFinalizeMock).toBeCalledWith();
    expect(tarPackEntryMock).toBeCalledTimes(1);
    expect(tarPackEntryMock).toBeCalledWith(
      { name: EXAMPLE_PATH },
      EXAMPLE_CODE
    );
    expect(tarPackPipeMock).toBeCalledTimes(1);
    expect(tarPackPipeMock).toBeCalledWith(EXAMPLE_GZIP);
    expect(getStream.buffer).toBeCalledTimes(1);
    expect(getStream.buffer).toBeCalledWith(MOCK_PACK);
  });
});
