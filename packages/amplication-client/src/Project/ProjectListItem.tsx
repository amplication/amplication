import React from "react";
import { Project } from "../models";
import {
  EnumTextStyle,
  EnumTextWeight,
  ListItem,
  Text,
} from "@amplication/ui/design-system";

type Props = {
  project: Project;
  workspaceId: string;
};

export const ProjectListItem = ({ project, workspaceId }: Props) => {
  return (
    <ListItem to={`/${workspaceId}/${project.id}`} showDefaultActionIcon={true}>
      <Text
        textStyle={EnumTextStyle.Normal}
        textWeight={EnumTextWeight.SemiBold}
      >
        {project.name}
      </Text>
      <Text textStyle={EnumTextStyle.Subtle}>{project.description}</Text>
    </ListItem>
  );
};
