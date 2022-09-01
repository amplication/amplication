import { Difference } from 'dir-compare';
import { join } from 'path';
import { PrModule } from '../../../constants';

export function deleteFilesVisitor({
  state,
  name1,
  type1,
  type2,
  relativePath,
}: Difference): PrModule | null {
  if (!name1) {
    return null;
  }
  if (state === 'left' && type2 === 'missing' && type1 !== 'directory') {
    const path = join(relativePath, name1);

    return {
      path: path,
      code: null,
    };
  }
  return null;
}
