import { Dialog, EnumTextColor, TabItem } from "@amplication/ui/design-system";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { match } from "react-router-dom";
import PageLayout from "../Layout/PageLayout";
import useTabRoutes from "../Layout/useTabRoutes";
import ResourceList from "../Workspaces/ResourceList";
import { AppContext } from "../context/appContext";
import { AppRouteProps } from "../routes/routesUtil";
import { expireCookie, getCookie } from "../util/cookie";
import PreviewUserLoginModal from "./ArchitectureConsole/PreviewUserLoginModal";
import "./ProjectPage.scss";

type Props = AppRouteProps & {
  match: match<{
    workspace: string;
    project: string;
  }>;
};
const OVERVIEW = "Project Catalog";

const ProjectPage: React.FC<Props> = ({
  innerRoutes,
  match,
  moduleClass,
  tabRoutes,
  tabRoutesDef,
}) => {
  const { pendingChanges } = useContext(AppContext);
  const [fromPreviewUserDialog, setFromPreviewUserDialog] =
    useState<boolean>(false);

  useEffect(() => {
    const isFromPreviewPlanCookieExist = getCookie("isFromPreviewPlan");

    if (isFromPreviewPlanCookieExist === "1") {
      setFromPreviewUserDialog(true);
    }

    isFromPreviewPlanCookieExist && expireCookie("isFromPreviewPlan");
  }, []);

  const handleFromPreviewUserDialogDismiss = useCallback(() => {
    setFromPreviewUserDialog(false);
  }, [setFromPreviewUserDialog]);

  const { tabs, currentRouteIsTab } = useTabRoutes(tabRoutesDef);

  const tabItems: TabItem[] = useMemo(() => {
    const tabsWithPendingChanges = tabs.map((tab) => {
      if (tab.name === "Pending Changes") {
        return {
          ...tab,
          indicatorValue: pendingChanges?.length
            ? pendingChanges.length
            : undefined,
          indicatorColor: EnumTextColor.White,
        };
      } else return tab;
    });

    return [
      {
        name: OVERVIEW,
        to: match.url,
        exact: true,
        textColor: EnumTextColor.ThemeBlue,
      },
      ...(tabsWithPendingChanges || []),
    ];
  }, [tabs, match.url, pendingChanges]);

  return match.isExact || currentRouteIsTab ? (
    <>
      <PageLayout className={moduleClass} tabs={tabItems}>
        {match.isExact ? (
          <>
            <Dialog
              isOpen={fromPreviewUserDialog}
              onDismiss={handleFromPreviewUserDialogDismiss}
              title={"Welcome Aboard! 🚀"}
            >
              <PreviewUserLoginModal />
            </Dialog>
            <ResourceList />
          </>
        ) : (
          tabRoutes
        )}
      </PageLayout>
    </>
  ) : (
    innerRoutes
  );
};

export default ProjectPage;
