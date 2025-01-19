import React from "react";
import "./LabelValuePairsBlock.scss";
import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";

export const CLASS_NAME = "amp-label-value-pairs-block";

export type Props = {
  children?: React.ReactNode;
};

export function LabelValuePairsBlock({ children }: Props) {
  return (
    <FlexItem
      className={CLASS_NAME}
      direction={EnumFlexDirection.Column}
      gap={EnumGapSize.Default}
      itemsAlign={EnumItemsAlign.Stretch}
      contentAlign={EnumContentAlign.Start}
    >
      {children}
    </FlexItem>
  );
}
