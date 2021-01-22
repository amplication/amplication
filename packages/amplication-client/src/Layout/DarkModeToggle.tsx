import React, { useCallback, useState } from "react";
import { Toggle } from "@amplication/design-system";

const LOCAL_STORAGE_KEY = "darkModeEnabled";

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
    <React.Suspense fallback={<></>}>
      <Toggle
        title="Dark mode"
        onValueChange={handleClick}
        checked={darkMode}
      />
      {String(darkMode)}
      {darkMode && <DarkModeCSS />}
    </React.Suspense>
  );
};

export default DarkModeToggle;
