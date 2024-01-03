import React, { lazy, useCallback, useState, useEffect, useMemo } from "react";
import { awsRum } from "./util/rum";
import { useLocation } from "react-router-dom";
import * as reactHotkeys from "react-hotkeys";
import ThemeProvider from "./Layout/ThemeProvider";
import { track, dispatch, init as initAnalytics } from "./util/analytics";
import { Routes } from "./routes/appRoutes";
import { routesGenerator } from "./routes/routesUtil";
import useAuthenticated from "./authentication/use-authenticated";
import useCurrentWorkspace from "./Workspaces/hooks/useCurrentWorkspace";
import useLocalStorage from "react-use-localstorage";
import queryString from "query-string";
import BreadcrumbsContext, {
  BreadcrumbItem,
} from "./Layout/BreadcrumbsContext";
import { sortBy } from "lodash";

//use specific import path to prevent inclusion of all the design-system CSS in the main bundle
import { AnimationType } from "@amplication/ui/design-system/components/Loader/Loader";
//use lazy loading imports to prevent inclusion of the components CSS in the main bundle
const FullScreenLoader = lazy(
  () =>
    import("@amplication/ui/design-system/components/Loader/FullScreenLoader")
);
const PlanUpgradeConfirmation = lazy(
  () =>
    import(
      "@amplication/ui/design-system/components/PlanUpgradeConfirmation/PlanUpgradeConfirmation"
    )
);

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

awsRum.enable();

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

  const [breadcrumbsItems, setBreadcrumbsItems] = useState<BreadcrumbItem[]>(
    []
  );

  const registerBreadcrumbItem = useCallback(
    (addItem: BreadcrumbItem) => {
      setBreadcrumbsItems((items) => {
        return sortBy(
          [...items.filter((item) => item.url !== addItem.url), addItem],
          (sortItem) => sortItem.url
        );
      });
    },
    [setBreadcrumbsItems]
  );

  const unregisterBreadcrumbItem = useCallback(
    (url: string) => {
      setBreadcrumbsItems((items) => {
        return sortBy(
          items.filter((item) => item.url !== url),
          (sortItem) => sortItem.url
        );
      });
    },
    [setBreadcrumbsItems]
  );

  const breadcrumbsContextValue = useMemo(
    () => ({
      breadcrumbsItems,
      registerItem: registerBreadcrumbItem,
      unregisterItem: unregisterBreadcrumbItem,
    }),
    [breadcrumbsItems, registerBreadcrumbItem, unregisterBreadcrumbItem]
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
      <BreadcrumbsContext.Provider value={breadcrumbsContextValue}>
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
      </BreadcrumbsContext.Provider>
    </ThemeProvider>
  );
}

export default enhance(App);
