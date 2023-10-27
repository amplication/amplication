import { Meta } from "@storybook/react";

import { VerticalNavigationItem } from "./VerticalNavigationItem";
import { VerticalNavigation } from "./VerticalNavigation";

export default {
  title: "List",
  component: VerticalNavigation,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <VerticalNavigation>
        <VerticalNavigationItem to={""}>Item 2</VerticalNavigationItem>
        <VerticalNavigationItem to={""}>Item 3</VerticalNavigationItem>
        <VerticalNavigationItem to={""}>Item 4</VerticalNavigationItem>
      </VerticalNavigation>
    );
  },
};
