import {
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Text,
} from "@amplication/ui/design-system";
import "./TitleAndIcon.scss";

type Props = {
  icon: string;
  title: string;
};

const CLASS_NAME = "title-and-icon";

export const TitleAndIcon = ({ icon, title }: Props) => {
  return (
    <FlexItem
      className={CLASS_NAME}
      itemsAlign={EnumItemsAlign.Center}
      gap={EnumGapSize.Small}
    >
      <Icon icon={icon} color={EnumTextColor.White} />
      <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.White}>
        {title}
      </Text>
    </FlexItem>
  );
};
