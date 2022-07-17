import React, { lazy } from "react";
import { match } from "react-router-dom";
import ScreenResolutionMessage from "../Layout/ScreenResolutionMessage";
import { PendingChangeItem } from "../VersionControl/PendingChangesContext";
import { isMobileOnly } from "react-device-detect";
import CompleteInvitation from "../User/CompleteInvitation";
import "./WorkspaceLayout.scss";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceFooter from "./WorkspaceFooter";

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

const WorkspaceLayout: React.FC<Props> = ({ InnerRoutes, moduleClass }) => {
  return isMobileOnly ? (
    <MobileMessage />
  ) : (
    <div className={moduleClass}>
      <WorkspaceHeader />
      <CompleteInvitation />
      <div className={`${moduleClass}__page_content`}>
        <div className={`${moduleClass}__side_menu`}>hello</div>
        <div className={`${moduleClass}__main_content`}>{InnerRoutes}</div>
        <div className={`${moduleClass}__changes_menu`}>pending changes</div>
      </div>
      <WorkspaceFooter />
      <ScreenResolutionMessage />
    </div>
  );
};

export default WorkspaceLayout;
