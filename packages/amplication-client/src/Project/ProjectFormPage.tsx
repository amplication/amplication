import {
  EnumFlexItemMargin,
  EnumItemsAlign,
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
import "./ProjectPage.scss";

function ProjectFormPage() {
  const { currentProjectConfiguration, currentProject, permissions } =
    useContext(AppContext);

  const canDeleteProject = permissions.canPerformTask("project.delete");

  return (
    <>
      <ResourceForm resourceId={currentProjectConfiguration?.id} />
      {canDeleteProject && (
        <>
          <FlexItem margin={EnumFlexItemMargin.Both}>
            <Text textStyle={EnumTextStyle.H4}>Delete Project</Text>
          </FlexItem>

          <Panel className={`delete__panel`}>
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
