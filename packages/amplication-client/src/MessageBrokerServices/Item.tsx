import {
  EnumFlexDirection,
  EnumGapSize,
  EnumTextStyle,
  EnumTextWeight,
  FlexItem,
  ListItem,
  Text,
} from "@amplication/ui/design-system";
import ResourceCircleBadge from "../Components/ResourceCircleBadge";
import { Resource } from "../models";
import "./Item.scss";

type Props = {
  link: string;
  service: Resource;
};

const description = "See connected service details ";

const Item = ({ link, service }: Props) => {
  return (
    <ListItem
      to={link}
      start={<ResourceCircleBadge type={service.resourceType} />}
    >
      <FlexItem direction={EnumFlexDirection.Column} gap={EnumGapSize.Small}>
        <Text
          textStyle={EnumTextStyle.Normal}
          textWeight={EnumTextWeight.SemiBold}
        >
          {service.name}
        </Text>
        {description && (
          <Text textStyle={EnumTextStyle.Description}>{description}</Text>
        )}
      </FlexItem>
    </ListItem>
  );
};

export { Item };
