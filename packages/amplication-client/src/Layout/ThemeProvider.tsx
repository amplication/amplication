import React, { useState, useCallback, useMemo } from "react";
import ThemeContext from "./ThemeContext";

type Props = {
  children: React.ReactNode;
};

function ThemeProvider({ children }: Props) {
  const [currentTheme, setCurrentTheme] = useState<string>("");

  const setTheme = useCallback(
    (theme: string) => {
      setCurrentTheme(theme);
    },
    [setCurrentTheme]
  );

  const ThemeContextValue = useMemo(
    () => ({
      theme: currentTheme,
      setTheme: setTheme,
    }),
    [currentTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={ThemeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
