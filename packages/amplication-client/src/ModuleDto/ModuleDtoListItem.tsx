import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
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
      direction={EnumFlexDirection.Column}
      itemsAlign={EnumItemsAlign.Start}
      gap={EnumGapSize.Default}
    >
      <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
        {moduleDto.name}
      </Text>
      <Text textStyle={EnumTextStyle.Description}>{moduleDto.description}</Text>
    </ListItem>
  );
};
