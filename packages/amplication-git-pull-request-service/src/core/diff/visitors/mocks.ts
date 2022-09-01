import { Difference } from 'dir-compare';
import { mock } from 'jest-mock-extended';

export const name1PlaceHolder = 'name1';

export const missingFolderMock = mock<Difference>({
  name1: name1PlaceHolder,
  type1: 'directory',
  type2: 'missing',
  state: 'left',
});
