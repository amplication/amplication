import {
  Button,
  CircleBadge,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Icon,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import PageContent from "../Layout/PageContent";
import { useProjectBaseUrl } from "../util/useProjectBaseUrl";
import "./PlatformDashboard.scss";
import PrivatePluginsTile from "./PrivatePluginsTile";
import TechDebtTile from "./TechDebtTile";
import TemplatesTile from "./TemplatesTile";

const PAGE_TITLE = "Platform Dashboard";

const CLASS_NAME = "platform-dashboard";

const PlatformDashboard = () => {
  const { baseUrl } = useProjectBaseUrl();

  return (
    <PageContent pageTitle={PAGE_TITLE}>
      <FlexItem>
        <FlexItem.FlexEnd direction={EnumFlexDirection.Row}>
          <Link to={`${baseUrl}/private-plugins`}>
            <Button buttonStyle={EnumButtonStyle.Outline}>
              Manage Plugins
            </Button>
          </Link>
          <Link to={`${baseUrl}/templates`}>
            <Button buttonStyle={EnumButtonStyle.Outline}>
              Manage Templates
            </Button>
          </Link>
        </FlexItem.FlexEnd>
      </FlexItem>

      <HorizontalRule doubleSpacing />

      <Panel panelStyle={EnumPanelStyle.Bordered}>
        <FlexItem itemsAlign={EnumItemsAlign.Center}>
          <FlexItem.FlexStart direction={EnumFlexDirection.Column}>
            <FlexItem
              direction={EnumFlexDirection.Row}
              gap={EnumGapSize.Small}
              itemsAlign={EnumItemsAlign.Center}
            >
              <CircleBadge themeColor={EnumTextColor.ThemeOrange} size="large">
                <Icon icon={"grid"} size={"small"} />
              </CircleBadge>
            </FlexItem>
            <Text textStyle={EnumTextStyle.H3}>Platform Console</Text>
            <Text
              textStyle={EnumTextStyle.Description}
              textColor={EnumTextColor.White}
            >
              The Platform Console lets teams define, manage, and enforce
              development standards at scale. It streamlines service creation
              with Live Templates for consistency and Private Plugins to
              integrate best practices and Golden Paths. With built-in
              governance, automated updates, and seamless integrations, it
              ensures efficiency and control.
            </Text>
          </FlexItem.FlexStart>
        </FlexItem>
      </Panel>

      <div className={`${CLASS_NAME}__split`}>
        <PrivatePluginsTile />
        <TemplatesTile />
      </div>
      <div>
        <TechDebtTile />
      </div>
    </PageContent>
  );
};

export default PlatformDashboard;
