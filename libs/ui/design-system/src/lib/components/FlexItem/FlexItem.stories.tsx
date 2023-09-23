import { Meta } from "@storybook/react";
import { Icon } from "../Icon/Icon";
import { FlexItem } from "./FlexItem";

export default {
  title: "FlexItem",
  component: FlexItem,
} as Meta;

export const Default = (props: any) => {
  return (
    <>
      <FlexItem near={<Icon icon="plus" />} far={<Icon icon="chevron_down" />}>
        Content of the item
      </FlexItem>
    </>
  );
};
