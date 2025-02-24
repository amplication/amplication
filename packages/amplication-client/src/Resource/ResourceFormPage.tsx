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
import { useQuery } from "@apollo/client";
import { RESOURCES_FROM_TEMPLATE_WITH_COUNT } from "../Catalog/queries/catalogQueries";
import * as models from "../models";

type Props = {
  match: match<{ resource: string }>;
};

function ResourceFormPage({ match }: Props) {
  const resourceId = match.params.resource;
  const { currentResource } = useAppContext();

  const permissions = useResourcePermissions(resourceId);
  const canDeleteResource = permissions.canPerformTask("resource.delete");
  const canEdit = permissions.canPerformTask("resource.*.edit");

  const { data, error, loading } = useQuery<{
    catalog: {
      data: models.Resource[];
      totalCount: number;
    };
  }>(RESOURCES_FROM_TEMPLATE_WITH_COUNT, {
    variables: {
      templateId: resourceId,
    },
  });

  const resourcesCount = data?.catalog.data.length;

  const resources = data?.catalog.data.map((resource) => resource.name) || [];

  return (
    <>
      <ResourceForm resourceId={resourceId} disabled={!canEdit} />
      {canDeleteResource && (
        <>
          <HorizontalRule />
          <TabContentTitle title="Delete Resource" />
          <Panel panelStyle={EnumPanelStyle.Error}>
            {!loading && (
              <FlexItem itemsAlign={EnumItemsAlign.Center}>
                <FlexItem.FlexStart>
                  {resourcesCount == 0 ? (
                    <Text
                      textColor={EnumTextColor.White}
                      textStyle={EnumTextStyle.Description}
                    >
                      Once you delete a resource, there is no going back. Please
                      be certain.
                    </Text>
                  ) : (
                    <>
                      <Text
                        textColor={EnumTextColor.White}
                        textStyle={EnumTextStyle.Description}
                      >
                        Cannot delete a template currently used by services
                        within the workspace. Please delete the services that
                        are using this template, then try deleting the template
                        again.
                      </Text>
                      <Text
                        textColor={EnumTextColor.White}
                        textStyle={EnumTextStyle.Description}
                      >
                        Services using this template: {resources.join(", ")}
                      </Text>
                    </>
                  )}
                </FlexItem.FlexStart>
                {resourcesCount == 0 && (
                  <FlexItem.FlexEnd>
                    <DeleteResourceButton resource={currentResource} />
                  </FlexItem.FlexEnd>
                )}
              </FlexItem>
            )}
          </Panel>
        </>
      )}
    </>
  );
}

export default ResourceFormPage;
