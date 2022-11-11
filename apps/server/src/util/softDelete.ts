export function prepareDeletedItemName(
  currentValue: string,
  id: string
): string {
  return `__${id}_${currentValue}`;
}

export function revertDeletedItemName(
  currentValue: string,
  id: string
): string {
  return currentValue.replace(`__${id}_`, '');
}
