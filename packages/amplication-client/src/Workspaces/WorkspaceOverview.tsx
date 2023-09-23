import { useContext } from "react";
import ProjectList from "../Project/ProjectList";
import { AppContext } from "../context/appContext";
import PageContent from "../Layout/PageContent";
import {
  Chip,
  CircleBadge,
  EnumChipStyle,
  EnumFlexItemMargin,
  EnumPanelStyle,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { getWorkspaceColor } from "./WorkspaceSelector";
import { EnumSubscriptionPlan } from "../models";
import AddNewProject from "../Project/AddNewProject";

const CLASS_NAME = "workspace-overview";
const PAGE_TITLE = "Workspace Overview";

const SUBSCRIPTION_TO_CHIP_STYLE: {
  [key in EnumSubscriptionPlan]: EnumChipStyle;
} = {
  [EnumSubscriptionPlan.Free]: EnumChipStyle.ThemePurple,
  [EnumSubscriptionPlan.Pro]: EnumChipStyle.ThemeBlue,
  [EnumSubscriptionPlan.Enterprise]: EnumChipStyle.ThemeGreen,
};

export const WorkspaceOverview = () => {
  const { currentWorkspace, projectsList } = useContext(AppContext);

  return (
    <PageContent className={CLASS_NAME} pageTitle={PAGE_TITLE}>
      <FlexItem far={<AddNewProject />} margin={EnumFlexItemMargin.None} />
      <HorizontalRule doubleSpacing />

      <Panel panelStyle={EnumPanelStyle.Bold}>
        <FlexItem
          near={
            <CircleBadge
              size="xlarge"
              name={currentWorkspace.name || ""}
              color={getWorkspaceColor(
                currentWorkspace.subscription?.subscriptionPlan
              )}
            />
          }
        >
          <Chip
            chipStyle={
              SUBSCRIPTION_TO_CHIP_STYLE[
                currentWorkspace.subscription?.subscriptionPlan
              ]
            }
          >
            {currentWorkspace.subscription?.subscriptionPlan ||
              EnumSubscriptionPlan.Free}{" "}
            Plan
          </Chip>

          <Text textStyle={EnumTextStyle.H3}>{currentWorkspace.name}</Text>
        </FlexItem>
      </Panel>
      <ProjectList projects={projectsList} workspaceId={currentWorkspace.id} />
    </PageContent>
  );
};

export default WorkspaceOverview;
