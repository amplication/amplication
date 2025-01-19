import { ReactNode } from "react";
import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";
import { EnumTextStyle, Text } from "../Text/Text";
import { CLASS_NAME } from "./LabelValuePairsBlock";
import "./LabelValuePairsBlock.scss";

export type Props = {
  label: string;
  content: ReactNode;
};
export function LabelValuePairsBlockItem({ label, content }: Props) {
  return (
    <div className={`${CLASS_NAME}__item`}>
      <FlexItem
        direction={EnumFlexDirection.Row}
        itemsAlign={EnumItemsAlign.Center}
        contentAlign={EnumContentAlign.Start}
      >
        <Text
          noWrap
          textStyle={EnumTextStyle.Description}
          className={`${CLASS_NAME}__item__label`}
        >
          {label}
        </Text>

        {content}
      </FlexItem>
    </div>
  );
}
