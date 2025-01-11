import React from "react";
import { Meta } from "@storybook/react";
import { IconPicker } from "./IconPicker";

export default {
  title: "IconPicker",
  component: IconPicker,
} as Meta;

export const Default = {
  render: (props: any) => {
    const [icon, setIcon] = React.useState("google");

    return <IconPicker onChange={setIcon} selectedIcon={icon} />;
  },
};
