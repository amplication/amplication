import React, { useCallback, useState } from "react";
import classNames from "classnames";
import { Button, EnumButtonStyle } from "../Components/Button";
import "./DarkModeToggle.scss";

const LOCAL_STORAGE_KEY = "darkModeEnabled";
const CLASS_NAME = "dark-mode-toggle";

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem(LOCAL_STORAGE_KEY) === "true"
  );

  const handleClick = useCallback(() => {
    const nextValue = !darkMode;
    setDarkMode(nextValue);
    localStorage.setItem(LOCAL_STORAGE_KEY, String(nextValue));
  }, [darkMode]);

  const DarkModeCSS = React.lazy(() => import("./DarkModeTheme"));

  return (
    <div
      className={classNames(CLASS_NAME, {
        [`${CLASS_NAME}--active`]: darkMode,
      })}
    >
      <Button
        type="button"
        buttonStyle={EnumButtonStyle.Clear}
        onClick={handleClick}
        eventData={{
          eventName: darkMode ? "disableDarkMode" : "enableDarkMode",
        }}
        icon={darkMode ? "dark_mode" : "light_mode"}
      />

      <React.Suspense fallback={<></>}>
        {darkMode && <DarkModeCSS />}
      </React.Suspense>
    </div>
  );
};

export default DarkModeToggle;
