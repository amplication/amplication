import React from "react";
import { Meta } from "@storybook/react";
import Breadcrumbs from "./Breadcrumbs";
import { BrowserRouter as Router } from "react-router-dom";

export default {
  title: "Breadcrumbs",
  component: Breadcrumbs,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <Router>
        <Breadcrumbs>
          <Breadcrumbs.Item to="">Page 1</Breadcrumbs.Item>
          <Breadcrumbs.Item to="">Page 2</Breadcrumbs.Item>
          <Breadcrumbs.Item to="">Page 3</Breadcrumbs.Item>
        </Breadcrumbs>
      </Router>
    );
  },
};
