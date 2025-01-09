import { match } from "react-router-dom";
import ResourceForm from "./ResourceForm";
import {
  TabContentTitle,
  EnumPanelStyle,
  FlexItem,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  Panel,
  Text,
  HorizontalRule,
} from "@amplication/ui/design-system";
import DeleteResourceButton from "../Workspaces/DeleteResourceButton";
import { useAppContext } from "../context/appContext";
import useResourcePermissions from "./hooks/useResourcePermissions";

type Props = {
  match: match<{ resource: string }>;
};

function ResourceFormPage({ match }: Props) {
  const resourceId = match.params.resource;
  const { currentResource } = useAppContext();

  const permissions = useResourcePermissions(resourceId);
  const canDeleteResource = permissions.canPerformTask("resource.delete");
  const canEdit = permissions.canPerformTask("resource.*.edit");

  return (
    <>
      <ResourceForm resourceId={resourceId} disabled={!canEdit} />
      {canDeleteResource && (
        <>
          <HorizontalRule />
          <TabContentTitle title="Delete Resource" />
          <Panel panelStyle={EnumPanelStyle.Error}>
            <FlexItem itemsAlign={EnumItemsAlign.Center}>
              <FlexItem.FlexStart>
                <Text
                  textColor={EnumTextColor.White}
                  textStyle={EnumTextStyle.Description}
                >
                  Once you delete a resource, there is no going back. Please be
                  certain.
                </Text>
              </FlexItem.FlexStart>
              <FlexItem.FlexEnd>
                <DeleteResourceButton resource={currentResource} />
              </FlexItem.FlexEnd>
            </FlexItem>
          </Panel>
        </>
      )}
    </>
  );
}

export default ResourceFormPage;
