import minimatch from 'minimatch';

export function isInAmplicationIgnore(
  amplicationIgnoreStatements: string[],
  filePath: string
): boolean {
  if (amplicationIgnoreStatements.length === 0) {
    return false;
  }

  const isInAmplicationIgnore = amplicationIgnoreStatements.some(
    globStatement => {
      const result = minimatch(filePath, globStatement, { dot: true });
      return result;
    }
  );
  return isInAmplicationIgnore;
}
