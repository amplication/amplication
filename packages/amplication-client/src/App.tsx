import React, { useEffect } from "react";
import * as reactHotkeys from "react-hotkeys";
import ThemeProvider from "./Layout/ThemeProvider";
import { track, dispatch, init as initAnalytics } from "./util/analytics";
import { init as initPaddle } from "./util/paddle";
import { Routes } from "./routes/appRoutes";
import { routesGenerator } from "./routes/routesUtil";
import useAuthenticated from "./authentication/use-authenticated";
import useCurrentWorkspace from "./Workspaces/hooks/useCurrentWorkspace";
import { CircularProgress } from "@amplication/design-system";

const GeneratedRoutes = routesGenerator(Routes);
const context = {
  source: "amplication-client",
};

export const enhance = track<keyof typeof context>(
  // app-level tracking data
  context,

  {
    dispatch,
  }
);

function App() {
  const authenticated = useAuthenticated();
  const { currentWorkspaceLoad } = useCurrentWorkspace(
    authenticated
  );

  useEffect(() => {
    initAnalytics();
    initPaddle();
  }, []);

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
      {currentWorkspaceLoad ? <CircularProgress /> : GeneratedRoutes}
    </ThemeProvider>
  );
}

export default enhance(App);
