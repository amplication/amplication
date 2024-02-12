import { EnumResourceType } from "@amplication/code-gen-types/models";
import {
  CircleBadge,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  List,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useContext, useEffect } from "react";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import DocsTile from "./DocsTile";
import EntitiesTile from "./EntitiesTile";
import FeatureRequestTile from "./FeatureRequestTile";
import RolesTile from "./RolesTile";
import { ServicesTile } from "./ServicesTile";
import SyncWithGithubTile from "./SyncWithGithubTile";
import { TopicsTile } from "./TopicsTile";
import ViewCodeViewTile from "./ViewCodeViewTile";
import { resourceThemeMap } from "./constants";
import PluginsTile from "./PluginsTile";
import { useStiggContext } from "@stigg/react-sdk";
import { BtmButton, EnumButtonLocation } from "./break-the-monolith/BtmButton";
import { FlexEnd } from "@amplication/ui/design-system/components/FlexItem/FlexItem";

const PAGE_TITLE = "Resource Overview";

const ResourceOverview = () => {
  const { currentResource } = useContext(AppContext);
  const { refreshData } = useStiggContext();

  const resourceId = currentResource?.id;

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <PageContent pageTitle={PAGE_TITLE}>
      <FlexItem>
        <FlexEnd>
          <BtmButton
            openInFullScreen
            autoRedirectAfterCompletion={false}
            location={EnumButtonLocation.Resource}
            ButtonStyle={EnumButtonStyle.GradientFull}
          />
        </FlexEnd>
      </FlexItem>

      <HorizontalRule doubleSpacing />

      <Panel panelStyle={EnumPanelStyle.Bold}>
        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          start={
            <CircleBadge
              name={currentResource?.name || ""}
              color={
                resourceThemeMap[currentResource?.resourceType].color ||
                "transparent"
              }
            />
          }
        >
          <FlexItem
            direction={EnumFlexDirection.Column}
            gap={EnumGapSize.Small}
          >
            <Text textStyle={EnumTextStyle.H3}>{currentResource?.name}</Text>
            <Text textStyle={EnumTextStyle.Description}>
              {currentResource?.description}
            </Text>
          </FlexItem>
        </FlexItem>
      </Panel>

      <List>
        <SyncWithGithubTile resourceId={resourceId} />
        {currentResource?.resourceType === EnumResourceType.Service && (
          <>
            <EntitiesTile resourceId={resourceId} />
            <PluginsTile resourceId={resourceId} />

            <RolesTile resourceId={resourceId} />
          </>
        )}
        {currentResource?.resourceType === EnumResourceType.MessageBroker && (
          <>
            <TopicsTile resourceId={resourceId} />

            <ServicesTile resourceId={resourceId} />
          </>
        )}
        <ViewCodeViewTile resourceId={resourceId} />

        <DocsTile />
        <FeatureRequestTile />
      </List>
    </PageContent>
  );
};

export default ResourceOverview;
