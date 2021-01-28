import React, { useCallback, useContext, useMemo } from "react";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "../Components/Button";
import useLocalStorage from "react-use-localstorage";
import ThemeContext from "./ThemeContext";
import "./DarkModeToggle.scss";

const LOCAL_STORAGE_KEY = "darkModeEnabled";
const CLASS_NAME = "dark-mode-toggle";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useLocalStorage(LOCAL_STORAGE_KEY, "false");

  const themeContext = useContext(ThemeContext);

  const isDarkMode = useMemo(() => {
    return darkMode === "true";
  }, [darkMode]);

  themeContext.setTheme(isDarkMode ? "dark-mode" : "");

  const handleClick = useCallback(() => {
    const nextIsDark = !isDarkMode;
    setDarkMode(String(nextIsDark));
    themeContext.setTheme(nextIsDark ? "dark-mode" : "");
  }, [setDarkMode, isDarkMode, themeContext]);

  const DarkModeCSS = React.lazy(() => import("./DarkModeTheme"));

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

      <React.Suspense fallback={<></>}>
        {isDarkMode && <DarkModeCSS />}
      </React.Suspense>
    </div>
  );
};

export default DarkModeToggle;
