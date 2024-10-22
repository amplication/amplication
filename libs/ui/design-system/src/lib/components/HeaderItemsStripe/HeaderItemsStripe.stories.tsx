import { Meta } from "@storybook/react";
import { HorizontalRule } from "../HorizontalRule/HorizontalRule";
import { Icon } from "../Icon/Icon";
import { EnumTextStyle, Text } from "../Text/Text";
import { VersionTag } from "../VersionTag/VersionTag";
import { HeaderItemsStripe } from "./HeaderItemsStripe";
import { HeaderItemsStripeItem } from "./HeaderItemsStripeItem";

export default {
  title: "HeaderItemsStripe",
  component: HeaderItemsStripe,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <>
        <HeaderItemsStripe {...props}>
          <HeaderItemsStripeItem
            label="Version"
            content={<VersionTag version={"1.0.0"} />}
          />
          <HeaderItemsStripeItem
            label="Name"
            content={<Text textStyle={EnumTextStyle.Description}>my name</Text>}
          />

          <HeaderItemsStripeItem label="Icon" content={<Icon icon="edit" />} />
        </HeaderItemsStripe>
        <HorizontalRule />
      </>
    );
  },
};
