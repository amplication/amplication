import {
  Button,
  EnumButtonStyle,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { CodeGeneratorImage } from "../../Components/CodeGeneratorImage";
import ResourceTypeBadge from "../../Components/ResourceTypeBadge";
import { useAppContext } from "../../context/appContext";
import PageContent from "../../Layout/PageContent";
import ResourceRelations from "../../Relation/ResourceRelations";
import { useResourceBaseUrl } from "../../util/useResourceBaseUrl";
import ResourceOwner from "../../Workspaces/ResourceOwner";

const PAGE_TITLE = "Overview";

const ComponentOverview = () => {
  const { currentResource } = useAppContext();

  const { baseUrl } = useResourceBaseUrl();

  return (
    <PageContent pageTitle={PAGE_TITLE}>
      <FlexItem>
        <FlexItem.FlexEnd direction={EnumFlexDirection.Row}>
          <Link to={`${baseUrl}/plugins/catalog`}>
            <Button buttonStyle={EnumButtonStyle.Primary}>
              Add functionality
            </Button>
          </Link>
        </FlexItem.FlexEnd>
      </FlexItem>
      <HorizontalRule doubleSpacing />
      <Panel panelStyle={EnumPanelStyle.Bold}>
        <FlexItem itemsAlign={EnumItemsAlign.Center}>
          <FlexItem.FlexStart direction={EnumFlexDirection.Column}>
            <FlexItem
              direction={EnumFlexDirection.Row}
              gap={EnumGapSize.Small}
              itemsAlign={EnumItemsAlign.Center}
            >
              <ResourceTypeBadge resource={currentResource} size="large" />

              <CodeGeneratorImage resource={currentResource} size="medium" />
            </FlexItem>
            <Text textStyle={EnumTextStyle.H3}>{currentResource?.name}</Text>
            <Text textStyle={EnumTextStyle.Description}>
              {currentResource?.description}
            </Text>
            <FlexItem
              direction={EnumFlexDirection.Row}
              itemsAlign={EnumItemsAlign.Center}
              gap={EnumGapSize.Default}
            >
              {currentResource && (
                <>
                  <Text textStyle={EnumTextStyle.Description}>Owner</Text>
                  <ResourceOwner resource={currentResource} />
                </>
              )}
            </FlexItem>
          </FlexItem.FlexStart>
        </FlexItem>
      </Panel>

      <ResourceRelations />
    </PageContent>
  );
};

export default ComponentOverview;
