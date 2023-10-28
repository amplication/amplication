import { Meta } from "@storybook/react";
import { VerticalNavigationItem } from "./VerticalNavigationItem";
import { VerticalNavigation } from "./VerticalNavigation";
import { BrowserRouter as Router } from "react-router-dom";

export default {
  title: "VerticalNavigation",
  component: VerticalNavigation,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <Router>
        <VerticalNavigation>
          <VerticalNavigationItem to={""}>Item 2</VerticalNavigationItem>
          <VerticalNavigationItem to={""}>Item 3</VerticalNavigationItem>
          <VerticalNavigationItem to={""}>Item 4</VerticalNavigationItem>
        </VerticalNavigation>
      </Router>
    );
  },
};
