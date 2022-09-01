import { DiffSet } from 'dir-compare';
import { PrModule } from '../../constants';
import { DiffVisitorFn } from './visitors/types';

export function mapDiffSetToPrModule(
  diffSet: DiffSet,
  visitors: DiffVisitorFn[] = []
): PrModule[] {
  const modules = diffSet.flatMap((diff) => {
    for (const visitor of visitors) {
      const result = visitor(diff);
      if (!result) {
        continue;
      }
      return result;
    }
    return null;
  });

  return modules.filter(notEmpty);
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  if (value === null || value === undefined) return false;
  return true;
}
