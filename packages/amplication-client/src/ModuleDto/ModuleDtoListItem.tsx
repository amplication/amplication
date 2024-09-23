import {
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import * as models from "../models";
import { useResourceBaseUrl } from "../util/useResourceBaseUrl";

type Props = {
  module: models.Module;
  moduleDto: models.ModuleDto;
};

export const ModuleDtoListItem = ({ module, moduleDto }: Props) => {
  const { baseUrl } = useResourceBaseUrl();

  if (!module) return null;

  const dtoUrl = `${baseUrl}/modules/${module.id}/dtos/${moduleDto.id}`;

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
