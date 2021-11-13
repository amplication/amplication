import isEmpty from 'lodash.isempty';
import { create, Config, Delta } from 'jsondiffpatch';

type DifferOptions = Pick<Config, 'objectHash' | 'propertyFilter'>;

type ExtendedJsonObject = { [Key in string]?: ExtendedJsonValue };
type ExtendedJsonArray = Array<ExtendedJsonValue>;
type ExtendedJsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | Date
  | ExtendedJsonObject
  | ExtendedJsonArray;

export class DiffService {
  public areDifferent(
    object?: ExtendedJsonObject,
    referenceObject?: ExtendedJsonObject,
    options: DifferOptions = {}
  ): boolean {
    const differ = create(options);
    const diff = differ.diff(referenceObject, object);

    return Boolean(diff) && this.diffHasChanges(diff);
  }

  private diffHasChanges(diff: Delta): boolean {
    return !isEmptyDeep(
      diff,
      (value, key) => this.isMovedArrayElement(value) || key === '_t' // "_t" indicates the type of data (could lead to false positive if not ignored)
    );
  }

  private isMovedArrayElement(value: unknown): boolean {
    //  3 at this index is the marker for a move operation
    // see : https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md#array-moves
    return Array.isArray(value) && value[2] === 3;
  }
}

function isEmptyDeep(
  objectOrArray: Record<string, unknown> | unknown[],
  ignorePredicate: (value: unknown, key: string | number) => boolean
): boolean {
  return Object.entries(objectOrArray).every(([key, value]) => {
    if (ignorePredicate(value, key)) {
      return true;
    }

    const isValueEmpty = isEmpty(value);

    if (isObjectOrArray(value) && !isValueEmpty) {
      return isEmptyDeep(value, ignorePredicate);
    }

    return value == null || (isObjectOrArray(value) && isValueEmpty);
  });
}

function isObjectOrArray(
  value: unknown
): value is Record<string, unknown> | unknown[] {
  return (
    Object.prototype.toString.call(value) === '[object Object]' ||
    Array.isArray(value)
  );
}
