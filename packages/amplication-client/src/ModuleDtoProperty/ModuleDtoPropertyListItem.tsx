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
  moduleId: string;
  moduleDtoId: string;
  moduleDtoProperty: models.ModuleDtoProperty;
};

export const ModuleDtoPropertyListItem = ({
  moduleId,
  moduleDtoId,
  moduleDtoProperty,
}: Props) => {
  const history = useHistory();
  const { currentWorkspace, currentProject, currentResource } =
    useContext(AppContext);

  if (!module) return null;

  const dtoUrl = `/${currentWorkspace?.id}/${currentProject?.id}/${currentResource?.id}/modules/${moduleId}/dtos/${moduleDtoId}/property${moduleDtoProperty.id}`;

  return (
    <ListItem
      to={dtoUrl}
      showDefaultActionIcon={false}
      direction={EnumFlexDirection.Row}
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Default}
    >
      <Text textStyle={EnumTextStyle.Description}>
        {moduleDtoProperty.name}
      </Text>
    </ListItem>
  );
};
