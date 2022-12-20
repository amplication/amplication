import React, { useCallback, useContext } from "react";
import classNames from "classnames";
import ThemeContext from "./ThemeContext";
import MenuItem from "../Layout/MenuItem";
import { useTracking } from "../util/analytics";
import "./DarkModeToggle.scss";
import { AnalyticsEventNames } from "../util/analytics-events.types";

const CLASS_NAME = "dark-mode-toggle";
const THEME_DARK = "dark";
const THEME_LIGHT = "light";
const DarkModeToggle = () => {
  const { trackEvent } = useTracking();

  const themeContext = useContext(ThemeContext);

  const handleClick = useCallback(() => {
    const nextTheme =
      themeContext.theme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;

    themeContext.setTheme(nextTheme);
    trackEvent({
      eventName: AnalyticsEventNames.ThemeSet,
      theme: nextTheme,
    });
  }, [themeContext, trackEvent]);

  const isDarkMode = themeContext.theme === THEME_DARK;

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
