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

  //varian 1
  // const luminance = chroma(validColor).luminance();
  // const textColor = luminance > 0.5 ? "var(--gray-full)" : "var(--gray-base)";
  // const backgroundColor = validColor;

  //varian 2
  const textColor = chroma(validColor).darken(1).mix("#000", 0.8).css();
  const backgroundColor = chroma(validColor)
    .brighten(0.6)
    .mix("#fff", 0.1)
    .css();

  //varian 3
  // const textColor = chroma(validColor).brighten(0.7).css();
  // const backgroundColor = "var(--gray-80)";

  const borderColor = "transparent";

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
