export const convertToNumber = (value: string): number => {
  const result = parseInt(value);
  if (isNaN(result)) {
    throw new Error(
      "error from convertToNumber() => GitHub App installation identifier is invalid"
    );
  }
  return result;
};
