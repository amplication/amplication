import React from "react";
import "./HeaderItemsStripe.scss";
import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";

export const CLASS_NAME = "amp-header-items-stripe";

export type Props = {
  children?: React.ReactNode;
};

export function HeaderItemsStripe({ children }: Props) {
  return (
    <FlexItem
      className={CLASS_NAME}
      direction={EnumFlexDirection.Row}
      gap={EnumGapSize.None}
      itemsAlign={EnumItemsAlign.Stretch}
      contentAlign={EnumContentAlign.Start}
    >
      {children}
    </FlexItem>
  );
}
