import chroma from "chroma-js";

const DEFAULT_COLOR = "#fff";

export const useTagColorStyle = (
  color: string = DEFAULT_COLOR
): {
  backgroundColor: string;
  borderColor: string;
  color: string;
  style: React.CSSProperties;
  themeVars: Record<string, string>;
} => {
  const validColor = chroma.valid(color) ? color : DEFAULT_COLOR;

  //varian 3
  const textColor = chroma(validColor).brighten(0.7).css();
  const backgroundColor = "var(--gray-80)";
  const borderColor = chroma(validColor).brighten(0.7).mix("#000", 0.5).css();

  return {
    backgroundColor,
    borderColor,
    color: textColor,
    style: {
      backgroundColor,
      borderColor,
      color: textColor,
    },
    themeVars: {
      "--tag-color": textColor,
      "--tag-background-color": backgroundColor,
      "--tag-border-color": borderColor,
    },
  };
};
