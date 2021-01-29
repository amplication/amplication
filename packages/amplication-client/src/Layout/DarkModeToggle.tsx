import React, { useCallback, useContext, useMemo } from "react";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "../Components/Button";
import useLocalStorage from "react-use-localstorage";
import ThemeContext from "./ThemeContext";
import "./DarkModeToggle.scss";

const LOCAL_STORAGE_KEY = "darkModeEnabled";
const CLASS_NAME = "dark-mode-toggle";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";
const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useLocalStorage(LOCAL_STORAGE_KEY, "false");

  const themeContext = useContext(ThemeContext);

  const isDarkMode = useMemo(() => {
    return darkMode === "true";
  }, [darkMode]);

  themeContext.setTheme(isDarkMode ? THEME_DARK : THEME_LIGHT);

  const handleClick = useCallback(() => {
    const nextIsDark = !isDarkMode;
    setDarkMode(String(nextIsDark));
    themeContext.setTheme(nextIsDark ? THEME_DARK : THEME_LIGHT);
  }, [setDarkMode, isDarkMode, themeContext]);

  return (
    <div
      className={classNames(CLASS_NAME, {
        [`${CLASS_NAME}--active`]: isDarkMode,
      })}
    >
      <Button
        type="button"
        buttonStyle={EnumButtonStyle.Clear}
        onClick={handleClick}
        eventData={{
          eventName: darkMode ? "disableDarkMode" : "enableDarkMode",
        }}
        icon={isDarkMode ? "dark_mode" : "light_mode"}
      />
    </div>
  );
};

export default DarkModeToggle;
