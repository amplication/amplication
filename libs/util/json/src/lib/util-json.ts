export const isValidJSON = (str: string) => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

export const JsonFormatting = (data: any) => {
  if (typeof data !== "string") {
    return JSON.stringify(data, null, 2);
  }
  try {
    const object = JSON.parse(data);
    return JSON.stringify(object, null, 2);
  } catch (e) {
    return data;
  }
};
