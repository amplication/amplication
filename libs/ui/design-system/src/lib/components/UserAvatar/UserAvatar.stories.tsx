import React from "react";
import { Meta } from "@storybook/react";
import { UserAvatar } from "./UserAvatar";

export default {
  title: "UserAvatar",
  component: UserAvatar,
} as Meta;

export const Default = (props: any) => {
  return <UserAvatar firstName="John" lastName="Bar" />;
};
