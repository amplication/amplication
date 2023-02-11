export function replacePlaceholdersInCode(
  code: string,
  mapping: { [key: string]: string | number | boolean | { [key: string]: any } }
): string {
  const regexStr = Object.keys(mapping)
    .map((key) => `\\$\{${key}}`)
    .join("|");

  const regex = new RegExp(regexStr, "gi");

  return code.replace(regex, (matched) => {
    const key = matched.slice(2, -1);
    if (mapping.hasOwnProperty(key)) {
      return mapping[key]?.toString() || "";
    } else {
      return matched;
    }
  });
}
