import React, { useCallback, useState, useEffect } from "react";
import * as reactHotkeys from "react-hotkeys";
import ThemeProvider from "./Layout/ThemeProvider";
import { track, dispatch, init as initAnalytics } from "./util/analytics";
import { init as initPaddle } from "./util/paddle";
import { Routes } from "./routes/appRoutes";
import { routesGenerator } from "./routes/routesUtil";
import useAuthenticated from "./authentication/use-authenticated";
import useCurrentWorkspace from "./Workspaces/hooks/useCurrentWorkspace";
import { Loader } from "@amplication/design-system";

const GeneratedRoutes = routesGenerator(Routes);
const context = {
  source: "client",
};

const MIN_ANIMATION_TIME = 2000;

export const enhance = track<keyof typeof context>(
  // app-level tracking data
  context,

  {
    dispatch,
  }
);

function App() {
  const authenticated = useAuthenticated();
  const { currentWorkspaceLoading } = useCurrentWorkspace(authenticated);
  const [keepLoadingAnimation, setKeepLoadingAnimation] =
    useState<boolean>(true);

  useEffect(() => {
    initAnalytics();
    initPaddle();
  }, []);

  const handleTimeout = useCallback(() => {
    setKeepLoadingAnimation(false);
  }, []);

  //The default behavior across all <HotKeys> components
  reactHotkeys.configure({
    //Disable simulate keypress events for the keys that do not natively emit them
    //When Enabled - events are not captured after using Enter in <textarea/>
    simulateMissingKeyPressEvents: false,
    //Clear the ignoreTags array to includes events on textarea and input
    ignoreTags: [],
  });

  const showLoadingAnimation = keepLoadingAnimation || currentWorkspaceLoading;

  return (
    <ThemeProvider>
      {showLoadingAnimation && (
        <Loader
          fullScreen
          minimumLoadTimeMS={MIN_ANIMATION_TIME}
          onTimeout={handleTimeout}
        />
      )}
      {!currentWorkspaceLoading && GeneratedRoutes}
    </ThemeProvider>
  );
}

export default enhance(App);
