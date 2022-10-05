import React, { useCallback, useMemo, useEffect } from "react";
import ThemeContext from "./ThemeContext";
import useLocalStorage from "react-use-localstorage";

type Props = {
  children: React.ReactNode;
};
const LOCAL_STORAGE_KEY = "amplicationTheme";

function ThemeProvider({ children }: Props) {
  const [currentTheme, setCurrentTheme] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    "dark"
  );

  const setTheme = useCallback(
    (theme: string) => {
      const currentThemeClass = `amp-theme-${currentTheme}`;
      document.body.classList.remove(currentThemeClass);
      setCurrentTheme(theme);
    },
    [setCurrentTheme, currentTheme]
  );

  const ThemeContextValue = useMemo(
    () => ({
      theme: currentTheme,
      setTheme: setTheme,
    }),
    [currentTheme, setTheme]
  );

  useEffect(() => {
    const nextThemeClass = `amp-theme-dark`;
    document.body.classList.add(nextThemeClass);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={ThemeContextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
