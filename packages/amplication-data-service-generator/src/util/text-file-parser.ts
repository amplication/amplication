export function replacePlaceholdersInCode(
  code: string,
  mapping: { [key: string]: string | number }
): string {
  const regexStr = Object.keys(mapping)
    .map((key) => `\\$\{${key}}`)
    .join("|");

  const regex = new RegExp(regexStr, "gi");

  return code.replace(regex, (matched) => {
    const key = matched.substr(2, matched.length - 3);
    if (mapping.hasOwnProperty(key)) {
      return mapping[key]?.toString() || "";
    } else {
      return matched;
    }
  });
}
