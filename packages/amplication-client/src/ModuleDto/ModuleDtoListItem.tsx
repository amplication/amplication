import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AppContext } from "../context/appContext";
import * as models from "../models";

type Props = {
  module: models.Module;
  moduleDto: models.ModuleDto;
};

export const ModuleDtoListItem = ({ module, moduleDto }: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  if (!module) return null;

  const dtoUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${module.id}/dtos/${moduleDto.id}`;

  return (
    <ListItem
      //to={dtoUrl} TODO: return in phase 2 (custom dtos implementation)
      showDefaultActionIcon={false}
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Default}
    >
      <Text textStyle={EnumTextStyle.Description}>{moduleDto.displayName}</Text>
    </ListItem>
  );
};
