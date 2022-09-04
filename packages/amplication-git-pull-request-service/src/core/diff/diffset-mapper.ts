import { DiffSet } from 'dir-compare';
import { PrModule } from '../../constants';
import { DiffVisitorFn } from './visitors/types';

/**
 * This method takes the diffSets and visitor functions and returns an array of modules.
 * We use the visitor pattern here (https://en.wikipedia.org/wiki/Visitor_pattern), which means
 * this function can be provided with any amount of "visitors". Each visitor function will be executed
 * and provided with each diffset.
 *
 * Empty results (null/undefined) will not be included in the final result.
 */
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
