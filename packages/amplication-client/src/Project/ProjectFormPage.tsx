import {
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Panel,
  Text,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import ResourceForm from "../Resource/ResourceForm";
import { AppContext } from "../context/appContext";
import { DeleteProject } from "./DeleteProject";

function ProjectFormPage() {
  const { currentProjectConfiguration, currentProject } =
    useContext(AppContext);

  return (
    <>
      <ResourceForm resourceId={currentProjectConfiguration?.id} />
      <FlexItem margin={EnumFlexItemMargin.Both}>
        <Text textStyle={EnumTextStyle.H4}>Delete Project</Text>
      </FlexItem>

      <Panel>
        <FlexItem itemsAlign={EnumItemsAlign.Center}>
          <FlexItem.FlexStart>
            <Text textStyle={EnumTextStyle.Description}>
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
  );
}

export default ProjectFormPage;
