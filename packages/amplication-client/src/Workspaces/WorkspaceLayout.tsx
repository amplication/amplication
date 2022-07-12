import React, { lazy } from "react";
import { match } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";

// import MenuItemWithFixedPanel from "../Layout/MenuItemWithFixedPanel";
// import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import { PendingChangeItem } from "../VersionControl/PendingChangesContext";
// import ResourceList from "./ResourceList";
// //import Subscription from "../Subscription/Subscription";
import { isMobileOnly } from "react-device-detect";
// import InnerTabLink from "../Layout/InnerTabLink";
// import MobileMessage from "../Layout/MobileMessage";
// import PageContent from "../Layout/PageContent";
// import RouteWithAnalytics from "../Layout/RouteWithAnalytics";
// import ProfilePage from "../Profile/ProfilePage";
import CompleteInvitation from "../User/CompleteInvitation";
// import MemberList from "./MemberList";
// import WorkspaceForm from "./WorkspaceForm";
import "./WorkspaceLayout.scss";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceFooter from "./WorkspaceFooter";
import { useAppContext } from "../context/appContext";
// import { CircularProgress } from "@amplication/design-system";
// import WorkspaceSelector from "./WorkspaceSelector";

const MobileMessage = lazy(() => import("../Layout/MobileMessage"));

export type PendingChangeStatusData = {
  pendingChanges: PendingChangeItem[];
};

type Props = {
  match: match<{
    workspace: string;
  }>;
  moduleClass: string;
  // eslint-disable-next-line no-undef
  InnerRoutes: JSX.Element | undefined;
};

const WorkspaceLayout: React.FC<Props> = ({
  InnerRoutes,
  moduleClass,
}) => {
  return isMobileOnly ? (
    <MobileMessage />
  ) : (
    <MainLayout className={moduleClass}>
      <WorkspaceHeader />
      <CompleteInvitation />
      {InnerRoutes}
      <WorkspaceFooter />
    </MainLayout>
  );
};

export default WorkspaceLayout;
