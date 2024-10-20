import { ReactNode } from "react";
import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";
import { EnumTextStyle, Text } from "../Text/Text";
import { CLASS_NAME } from "./HeaderItemsStripe";
import "./HeaderItemsStripe.scss";

export type Props = {
  label: string;
  content: ReactNode;
};
export function HeaderItemsStripeItem({ label, content }: Props) {
  return (
    <div className={`${CLASS_NAME}__item`}>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Start}
        contentAlign={EnumContentAlign.Space}
      >
        <Text noWrap textStyle={EnumTextStyle.Description}>
          {label}
        </Text>

        {content}
      </FlexItem>
    </div>
  );
}
