import React, { useEffect } from "react";
import * as reactHotkeys from "react-hotkeys";
import NavigationTabsProvider from "./Layout/NavigationTabsProvider";
import ThemeProvider from "./Layout/ThemeProvider";
import { track, dispatch, init as initAnalytics } from "./util/analytics";
import { init as initPaddle } from "./util/paddle";
import { useRouteMatch } from "react-router-dom";
import { OldRoutes } from "./appRoutes";
import { routesGenerator } from "./routesUtil";

const context = {
  source: "amplication-client",
};

const GeneratedRoutes = routesGenerator(OldRoutes);

export const enhance = track<keyof typeof context>(
  // app-level tracking data
  context,

  {
    dispatch,
  }
);

function App() {
  // const location = useLocation();
  const match = useRouteMatch();
  useEffect(() => {
    initAnalytics();
    initPaddle();
  }, []);

  useEffect(() => {
    console.log("match", match);
  }, [match]);

  //The default behavior across all <HotKeys> components
  reactHotkeys.configure({
    //Disable simulate keypress events for the keys that do not natively emit them
    //When Enabled - events are not captured after using Enter in <textarea/>
    simulateMissingKeyPressEvents: false,
    //Clear the ignoreTags array to includes events on textarea and input
    ignoreTags: [],
  });

  return (
    <ThemeProvider>
      <NavigationTabsProvider>{GeneratedRoutes}</NavigationTabsProvider>
    </ThemeProvider>
  );
}

export default enhance(App);
