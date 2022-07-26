import minimatch from 'minimatch';

export function isInAmplicationIgnore(
  amplicationIgnoreExpressions: string[],
  filePath: string
): boolean {
  if (amplicationIgnoreExpressions.length === 0) {
    return false;
  }

  const isInAmplicationIgnore = amplicationIgnoreExpressions.some(
    globStatement => {
      const result = minimatch(filePath, globStatement, { dot: true });
      return result;
    }
  );
  return isInAmplicationIgnore;
}
