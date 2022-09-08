import { Difference } from 'dir-compare';
import { mock } from 'jest-mock-extended';

export const missingFolderMock = mock<Difference>({
  name1: 'name1',
  type1: 'directory',
  type2: 'missing',
  state: 'left',
});
