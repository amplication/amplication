import {
  EnumFlexDirection,
  EnumGapSize,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  Popover,
  Text,
} from "@amplication/ui/design-system";
import "./BetaFeatureTag.scss";
import React from "react";

const TOOLTIP_DIRECTION = "bottom-end";

type Props = {
  tagLabel?: string;
  children?: React.ReactNode;
};
const CLASS_NAME = "beta-feature-tag";

function BetaFeatureTag({ tagLabel, children }: Props) {
  return (
    <Popover
      className="main-layout__menu__popover"
      content={
        <div className={`${CLASS_NAME}__tooltip-content`}>{children}</div>
      }
      placement={TOOLTIP_DIRECTION}
    >
      <div className={`${CLASS_NAME}__tag`}>
        <Text textStyle={EnumTextStyle.Tag} textColor={EnumTextColor.Black}>
          {tagLabel || "Beta Feature"}
        </Text>
        <Icon icon="icon-publish" />
      </div>
    </Popover>
  );
}

export default BetaFeatureTag;
