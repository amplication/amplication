import { Meta } from "@storybook/react";
import { CollapsibleListItem } from "./CollapsibleListItem";
import { CollapsibleList } from "./CollapsibleList";
import { BrowserRouter as Router } from "react-router-dom";

export default {
  title: "CollapsibleList",
  component: CollapsibleList,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <Router>
        <CollapsibleList>
          <CollapsibleListItem to={""}>Item 2</CollapsibleListItem>
          <CollapsibleListItem to={""}>Item 3</CollapsibleListItem>
          <CollapsibleListItem to={""}>Item 4</CollapsibleListItem>
        </CollapsibleList>
      </Router>
    );
  },
};
