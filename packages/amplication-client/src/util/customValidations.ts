export function isEqual(value1: string, value2: string) {
  return (
    value1?.toLocaleLowerCase().trim() === value2?.toLocaleLowerCase().trim()
  );
}
