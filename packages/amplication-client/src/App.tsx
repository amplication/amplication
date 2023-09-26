import React, { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as reactHotkeys from "react-hotkeys";
import ThemeProvider from "./Layout/ThemeProvider";
import { track, dispatch, init as initAnalytics } from "./util/analytics";
import { Routes } from "./routes/appRoutes";
import { routesGenerator } from "./routes/routesUtil";
import useAuthenticated from "./authentication/use-authenticated";
import useCurrentWorkspace from "./Workspaces/hooks/useCurrentWorkspace";
import {
  AnimationType,
  FullScreenLoader,
  PlanUpgradeConfirmation,
} from "@amplication/ui/design-system";
import useLocalStorage from "react-use-localstorage";
import queryString from "query-string";

declare global {
  interface Window {
    HubSpotConversations: any;
    hsConversationsOnReady: any;
    hsConversationsSettings: any;
  }
}

export const LOCAL_STORAGE_KEY_INVITATION_TOKEN = "invitationToken";
export const LOCAL_STORAGE_KEY_COUPON_CODE = "couponCode";

const GeneratedRoutes = routesGenerator(Routes);
const context = {
  source: "amplication-client",
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
  const location = useLocation();
  const { currentWorkspaceLoading } = useCurrentWorkspace(authenticated);
  const [keepLoadingAnimation, setKeepLoadingAnimation] =
    useState<boolean>(true);

  useEffect(() => {
    initAnalytics();
  }, []);

  const handleTimeout = useCallback(() => {
    setKeepLoadingAnimation(false);
  }, []);

  const [, setInvitationToken] = useLocalStorage(
    LOCAL_STORAGE_KEY_INVITATION_TOKEN,
    undefined
  );

  const [, setCouponCode] = useLocalStorage(
    LOCAL_STORAGE_KEY_COUPON_CODE,
    undefined
  );

  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.invitation) {
      //save the invitation token in local storage to be validated by
      //<CompleteInvitation/> after signup or sign in
      //we use local storage since github-passport does not support dynamic callback
      setInvitationToken(params.invitation as string);
    }
  }, [setInvitationToken, location.search]);

  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params["coupon-code"]) {
      //save the coupon code token in local storage to be validated by
      //<CompleteCoupon/> after signup or sign in
      setCouponCode(params["coupon-code"] as string);
    }
  }, [setCouponCode, location.search]);

  const [workspaceUpgradeConfirmation, setWorkspaceUpgradeConfirmation] =
    useState<boolean>(false);

  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.checkoutCompleted === "true") {
      setWorkspaceUpgradeConfirmation(true);
    }
  }, [setWorkspaceUpgradeConfirmation, location.search]);

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
        <FullScreenLoader
          animationType={AnimationType.Full}
          minimumLoadTimeMS={MIN_ANIMATION_TIME}
          onTimeout={handleTimeout}
        />
      )}
      {!currentWorkspaceLoading && GeneratedRoutes}
      {workspaceUpgradeConfirmation && (
        <PlanUpgradeConfirmation
          isOpen={workspaceUpgradeConfirmation}
          onConfirm={() => setWorkspaceUpgradeConfirmation(false)}
          onDismiss={() => setWorkspaceUpgradeConfirmation(false)}
        />
      )}
    </ThemeProvider>
  );
}

export default enhance(App);
