import React from "react";
import { Meta } from "@storybook/react";
import { TabContentTitle } from "./TabContentTitle";

export default {
  title: "TabContentTitle",
  component: TabContentTitle,
} as Meta;

export const Default = () => {
  return (
    <>
      <TabContentTitle title="Main Title" subTitle="Sub Title" />
    </>
  );
};
