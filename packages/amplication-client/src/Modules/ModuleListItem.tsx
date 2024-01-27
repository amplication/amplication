import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import { AppContext } from "../context/appContext";
import * as models from "../models";

type Props = {
  module: models.Module;
};

export const ModuleListItem = ({ module }: Props) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  if (!module) return null;

  const moduleUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}/edit`;

  return (
    <ListItem
      showDefaultActionIcon
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Default}
      to={moduleUrl}
    >
      <Text textStyle={EnumTextStyle.Description}>{module.displayName}</Text>
    </ListItem>
  );
};
