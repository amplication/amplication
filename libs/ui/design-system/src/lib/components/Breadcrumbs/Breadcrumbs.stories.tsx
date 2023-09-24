import React from "react";
import { Meta } from "@storybook/react";
import Breadcrumbs from "./Breadcrumbs";

export default {
  title: "Breadcrumbs",
  component: Breadcrumbs,
} as Meta;

export const Default = (props: any) => {
  return (
    <Breadcrumbs>
      <Breadcrumbs.Item to="">Page 1</Breadcrumbs.Item>
      <Breadcrumbs.Item to="">Page 2</Breadcrumbs.Item>
      <Breadcrumbs.Item to="">Page 3</Breadcrumbs.Item>
    </Breadcrumbs>
  );
};
