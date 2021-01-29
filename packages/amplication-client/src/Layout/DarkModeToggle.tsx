import React, { useCallback, useContext, useMemo } from "react";
import classNames from "classnames";
import useLocalStorage from "react-use-localstorage";
import ThemeContext from "./ThemeContext";
import MenuItem from "../Layout/MenuItem";
import { useTracking } from "../util/analytics";
import "./DarkModeToggle.scss";

const LOCAL_STORAGE_KEY = "darkModeEnabled";
const CLASS_NAME = "dark-mode-toggle";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";
const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useLocalStorage(LOCAL_STORAGE_KEY, "false");
  const { trackEvent } = useTracking();

  const themeContext = useContext(ThemeContext);

  const isDarkMode = useMemo(() => {
    return darkMode === "true";
  }, [darkMode]);

  themeContext.setTheme(isDarkMode ? THEME_DARK : THEME_LIGHT);

  const handleClick = useCallback(() => {
    const nextIsDark = !isDarkMode;
    setDarkMode(String(nextIsDark));
    themeContext.setTheme(nextIsDark ? THEME_DARK : THEME_LIGHT);
    trackEvent({
      eventName: isDarkMode ? "disableDarkMode" : "enableDarkMode",
    });
  }, [setDarkMode, isDarkMode, themeContext, trackEvent]);

  return (
    <MenuItem
      className={classNames(CLASS_NAME, {
        [`${CLASS_NAME}--active`]: isDarkMode,
      })}
      title="Toggle dark mode"
      icon={isDarkMode ? "dark_mode" : "light_mode"}
      onClick={handleClick}
    />
  );
};

export default DarkModeToggle;
