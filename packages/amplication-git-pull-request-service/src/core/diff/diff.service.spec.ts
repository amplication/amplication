import { DiffService } from './diff.service';
import { MOCK_BUILD_PATH_FACTORY } from './utils/BuildPathFactory.mock';

const amplicationAppId = 'appId';

const logger = {
  debug: jest.fn(),
  log: jest.fn(),
  info: jest.fn(),
  error: jest.fn(),
  format: Symbol('EXAMPLE_LOGGER_FORMAT'),
};

describe('Testing the diff service', () => {
  let diffService: DiffService;
  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    diffService = new DiffService(MOCK_BUILD_PATH_FACTORY, logger);
  });
  it('should throw error if the builds id is the same', () => {
    return expect(
      diffService.listOfChangedFiles(amplicationAppId, 'same', 'same')
    ).rejects.toThrowError();
  });
});
