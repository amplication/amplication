import {
  EnumTextStyle,
  EnumTextWeight,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { Link } from "react-router-dom";
import { Project } from "../models";

type Props = {
  project: Project;
  workspaceId: string;
};

export const ProjectListItem = ({ project, workspaceId }: Props) => {
  return (
    <ListItem showDefaultActionIcon={true} to={`/${workspaceId}/${project.id}`}>
      <Text
        textStyle={EnumTextStyle.Normal}
        textWeight={EnumTextWeight.SemiBold}
      >
        {project.name}
      </Text>

      <Text textStyle={EnumTextStyle.Description}>{project.description}</Text>
    </ListItem>
  );
};
