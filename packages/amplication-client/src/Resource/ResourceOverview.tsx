import { EnumResourceType } from "@amplication/code-gen-types/models";
import {
  CircleBadge,
  EnumFlexItemContentDirection,
  EnumPanelStyle,
  EnumTextStyle,
  FlexItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import PageContent from "../Layout/PageContent";
import { AppContext } from "../context/appContext";
import DocsTile from "./DocsTile";
import EntitiesTile from "./EntitiesTile";
import FeatureRequestTile from "./FeatureRequestTile";
import OverviewTile from "./OverviewTile";
import RolesTile from "./RolesTile";
import { ServicesTile } from "./ServicesTile";
import SyncWithGithubTile from "./SyncWithGithubTile";
import { TopicsTile } from "./TopicsTile";
import ViewCodeViewTile from "./ViewCodeViewTile";
import { resourceThemeMap } from "./constants";

const CLASS_NAME = "resource-home";
const PAGE_TITLE = "Resource Overview";

const ResourceOverview = () => {
  const { currentResource } = useContext(AppContext);

  const resourceId = currentResource?.id;

  return (
    <PageContent pageTitle={PAGE_TITLE}>
      <Panel panelStyle={EnumPanelStyle.Bold}>
        <FlexItem
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
          <FlexItem contentDirection={EnumFlexItemContentDirection.Column}>
            <Text textStyle={EnumTextStyle.H3}>{currentResource?.name}</Text>
            <Text textStyle={EnumTextStyle.Subtle}>
              {currentResource?.description}
            </Text>
          </FlexItem>
        </FlexItem>
      </Panel>

      <div className={`${CLASS_NAME}__tiles`}>
        {currentResource?.resourceType === EnumResourceType.Service && (
          <OverviewTile resourceId={resourceId} />
        )}
        <SyncWithGithubTile resourceId={resourceId} />
        <ViewCodeViewTile resourceId={resourceId} />
        {currentResource?.resourceType === EnumResourceType.Service && (
          <EntitiesTile resourceId={resourceId} />
        )}
        {currentResource?.resourceType === EnumResourceType.Service && (
          <RolesTile resourceId={resourceId} />
        )}
        {currentResource?.resourceType === EnumResourceType.MessageBroker && (
          <TopicsTile resourceId={resourceId} />
        )}
        {currentResource?.resourceType === EnumResourceType.MessageBroker && (
          <ServicesTile resourceId={resourceId} />
        )}
        <DocsTile />
        <FeatureRequestTile />
      </div>
    </PageContent>
  );
};

export default ResourceOverview;
