export const isValidJSON = (str: string) => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};
