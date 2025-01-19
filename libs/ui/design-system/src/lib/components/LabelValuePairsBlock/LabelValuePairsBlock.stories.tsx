import { Meta } from "@storybook/react";
import { HorizontalRule } from "../HorizontalRule/HorizontalRule";
import { Icon } from "../Icon/Icon";
import { EnumTextStyle, Text } from "../Text/Text";
import { VersionTag } from "../VersionTag/VersionTag";
import { LabelValuePairsBlock } from "./LabelValuePairsBlock";
import { LabelValuePairsBlockItem } from "./LabelValuePairsBlockItem";

export default {
  title: "LabelValuePairsBlock",
  component: LabelValuePairsBlock,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <>
        <LabelValuePairsBlock {...props}>
          <LabelValuePairsBlockItem
            label="Version"
            content={<VersionTag version={"1.0.0"} />}
          />
          <LabelValuePairsBlockItem
            label="Name"
            content={<Text textStyle={EnumTextStyle.Description}>my name</Text>}
          />

          <LabelValuePairsBlockItem
            label="Long label with text with spaces that cannot be displayed in full"
            content={<Text textStyle={EnumTextStyle.Description}>my name</Text>}
          />

          <LabelValuePairsBlockItem
            label="Icon"
            content={<Icon icon="edit" />}
          />
        </LabelValuePairsBlock>
        <HorizontalRule />
      </>
    );
  },
};
