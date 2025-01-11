import {
  EnumTextColor,
  EnumTextStyle,
  Icon,
  Popover,
  Text,
} from "@amplication/ui/design-system";
import React from "react";
import "./BetaFeatureTag.scss";

const TOOLTIP_DIRECTION = "bottom-end";

type Props = {
  tagLabel?: string;
  children?: React.ReactNode;
};
const CLASS_NAME = "beta-feature-tag";

function BetaFeatureTag({ tagLabel, children }: Props) {
  return (
    <Popover
      disableHoverListener={false}
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
