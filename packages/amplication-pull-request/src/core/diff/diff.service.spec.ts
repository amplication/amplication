import { DiffService, SAME_FOLDER_ERROR } from './diff.service';
import { MOCK_BUILD_PATH_FACTORY } from './utils/BuildPathFactory.mock';

const amplicationAppId = 'appId';

describe('Testing the diff service', () => {
  let diffService: DiffService;
  beforeEach(() => {
    diffService = new DiffService(MOCK_BUILD_PATH_FACTORY);
  });
  it('should throw error if the builds id is the same', () => {
    return expect(
      diffService.listOfChangedFiles(amplicationAppId, 'same', 'same')
    ).rejects.toThrowError();
  });
});
