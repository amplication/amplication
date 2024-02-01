import { Meta } from "@storybook/react";
import { List } from "./List";
import { ListItem } from "./ListItem";

export default {
  title: "List",
  component: List,
} as Meta;

export const Default = {
  render: (props: any) => {
    return (
      <>
        <List>
          <ListItem>Item 1</ListItem>
          <ListItem>Item 2</ListItem>
          <ListItem>Item 3</ListItem>
          <ListItem>Item 4</ListItem>
        </List>
      </>
    );
  },
};
