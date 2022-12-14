import { format } from "prettier";

export const formatCode = (code: string): string => {
  return format(code, { parser: "typescript" });
};

export const formatJson = (code: string): string => {
  return format(code, { parser: "json" });
};
