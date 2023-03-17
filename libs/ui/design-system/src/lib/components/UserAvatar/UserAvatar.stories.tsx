import React from "react";
import { Meta } from "@storybook/react/types-6-0";
import { UserAvatar } from "./UserAvatar";

export default {
  title: "UserAvatar",
  component: UserAvatar,
} as Meta;

export const Default = (props: any) => {
  return <UserAvatar firstName="John" lastName="Bar" />;
};
