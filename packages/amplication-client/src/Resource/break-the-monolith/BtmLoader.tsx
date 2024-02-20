import React from "react";
import {
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
  Text,
  Loader,
  AnimationType,
  EnumTextStyle,
  EnumTextAlign,
  EnumTextColor,
} from "@amplication/ui/design-system";

const CLASS_NAME = "btm-loader";

type Props = {
  title: string;
  subtitle?: string;
};

export const BtmLoader: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <div className={`${CLASS_NAME}__overlay`}>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Center}
      >
        <Text textStyle={EnumTextStyle.H3}>{title}</Text>
        <Text
          textColor={EnumTextColor.Black20}
          textAlign={EnumTextAlign.Center}
        >
          {subtitle}
        </Text>
        <Loader animationType={AnimationType.Full} />
      </FlexItem>
    </div>
  );
};
