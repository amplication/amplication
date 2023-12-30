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
  moduleDto: models.ModuleDto;
};

export const ModuleDtoListItem = ({ module, moduleDto }: Props) => {
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  if (!module) return null;

  const dtoUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}/dtos/${moduleDto.id}`;

  return (
    <ListItem
      to={dtoUrl}
      showDefaultActionIcon={false}
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Default}
    >
      <Text textStyle={EnumTextStyle.Description}>{moduleDto.name}</Text>
    </ListItem>
  );
};
