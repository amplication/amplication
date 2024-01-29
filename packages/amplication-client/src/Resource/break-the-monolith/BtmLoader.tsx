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

export const BtmLoader: React.FC = () => {
  return (
    <div className={`${CLASS_NAME}__overlay`}>
      <FlexItem
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Center}
      >
        <Text textStyle={EnumTextStyle.H3}>
          Experience the Microservices Marvel using Amplication AI
        </Text>
        <Text
          textColor={EnumTextColor.Black20}
          textAlign={EnumTextAlign.Center}
        >
          Our AI-driven magic is currently at work, suggesting how to elevate
          your service and its entities into a thriving microservices wonderland
        </Text>
        <Loader animationType={AnimationType.Full} />
      </FlexItem>
    </div>
  );
};
