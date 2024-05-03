import { Meta } from "@storybook/react";
import { JumboButton } from "./JumboButton";

export default {
  title: "JumboButton",
  component: JumboButton,
} as Meta;

export const Default = {
  render: (args: any) => {
    return <JumboButton {...args} />;
  },
};
