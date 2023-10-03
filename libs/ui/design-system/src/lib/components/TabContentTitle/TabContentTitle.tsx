import {
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  FlexItem,
} from "../FlexItem/FlexItem";
import { EnumTextStyle, Text } from "../Text/Text";

export type Props = {
  title: string;
  subTitle?: string;
};

const CLASS_NAME = "amp-tab-content-title";

export function TabContentTitle({ title, subTitle }: Props) {
  return (
    <FlexItem
      className={CLASS_NAME}
      direction={EnumFlexDirection.Column}
      gap={EnumGapSize.Small}
      margin={EnumFlexItemMargin.Bottom}
    >
      <Text textStyle={EnumTextStyle.H4}>{title}</Text>
      <Text textStyle={EnumTextStyle.Description}>{subTitle}</Text>
    </FlexItem>
  );
}
