const cssNamingConverter = (str: string) => {
  if (!str.length) return "";

  return str
    .split("")
    .reduce((className: string, char: string, idx: number) => {
      const matchChar = char.match(/[A-Z]/g);
      className += matchChar
        ? `${idx > 0 ? "-" : ""}${char.toLowerCase()}`
        : char;

      return className;
    }, "");
};

export default cssNamingConverter;
