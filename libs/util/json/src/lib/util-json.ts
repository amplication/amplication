export const isValidJSON = (str: string) => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

export const JsonFormatting = (json: string) => {
  if (Object.prototype.toString.call(json) === "[object Object]") {
    json = JSON.stringify(json);
  }
  const isValid = isValidJSON(json);
  if (isValid) {
    return JSON.stringify(JSON.parse(json!), null, "\t");
  }
  return json;
};
