import {
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumPanelStyle,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import ResourceForm from "../Resource/ResourceForm";
import { AppContext } from "../context/appContext";
import { DeleteProject } from "./DeleteProject";
import useResourcePermissions from "../Resource/hooks/useResourcePermissions";

function ProjectFormPage() {
  const { currentProjectConfiguration, currentProject } =
    useContext(AppContext);

  const permissions = useResourcePermissions(currentProjectConfiguration?.id);
  const canDeleteProject = permissions.canPerformTask("project.delete");
  const canEdit = permissions.canPerformTask("project.settings.edit");

  return (
    <>
      <ResourceForm
        resourceId={currentProjectConfiguration?.id}
        disabled={!canEdit}
      />
      {canDeleteProject && (
        <>
          <FlexItem margin={EnumFlexItemMargin.Both}>
            <Text textStyle={EnumTextStyle.H4}>Delete Project</Text>
          </FlexItem>

          <Panel panelStyle={EnumPanelStyle.Error}>
            <FlexItem itemsAlign={EnumItemsAlign.Center}>
              <FlexItem.FlexStart>
                <Text
                  textColor={EnumTextColor.White}
                  textStyle={EnumTextStyle.Description}
                >
                  Once you delete a project, there is no going back. Please be
                  certain.
                </Text>
              </FlexItem.FlexStart>
              <FlexItem.FlexEnd>
                <DeleteProject project={currentProject} />
              </FlexItem.FlexEnd>
            </FlexItem>
          </Panel>
        </>
      )}
    </>
  );
}

export default ProjectFormPage;
