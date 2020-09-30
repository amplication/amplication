import { Buffer } from 'buffer';
import tar from 'tar-stream';
import getStream from 'get-stream';
import { createTarFileFromModules } from './tar';

jest.mock('tar');
const tarPackEntryEndMock = jest.fn();
const tarPackEntryMock = jest.fn(() => ({
  end: tarPackEntryEndMock
}));
const tarFinalizeMock = jest.fn();
const MOCK_PACK = {
  entry: tarPackEntryMock,
  finalize: tarFinalizeMock
};
// eslint-disable-next-line
// @ts-ignore
tar.pack = jest.fn(() => MOCK_PACK);

const EXAMPLE_BUFFER = Buffer.from([]);

jest.mock('get-stream');
// eslint-disable-next-line
// @ts-ignore
getStream.buffer.mockImplementation(() => Promise.resolve(EXAMPLE_BUFFER));

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
    await expect(createTarFileFromModules(modules)).resolves.toBe(
      EXAMPLE_BUFFER
    );
    expect(tar.pack).toBeCalledTimes(1);
    expect(tar.pack).toBeCalledWith();
    expect(tarPackEntryEndMock).toBeCalledTimes(1);
    expect(tarPackEntryEndMock).toBeCalledWith();
    expect(tarFinalizeMock).toBeCalledTimes(1);
    expect(tarFinalizeMock).toBeCalledWith();
    expect(tarPackEntryMock).toBeCalledTimes(1);
    expect(tarPackEntryMock).toBeCalledWith(
      { name: EXAMPLE_PATH },
      EXAMPLE_CODE
    );
    expect(getStream.buffer).toBeCalledTimes(1);
    expect(getStream.buffer).toBeCalledWith(MOCK_PACK);
  });
});
