import { Meta } from "@storybook/react";
import { Icon } from "../Icon/Icon";
import { FlexItem } from "./FlexItem";
import "./FlexItem.stories.scss";
import { EnumTextStyle, Text } from "../Text/Text";

export default {
  title: "FlexItem",
  component: FlexItem,
} as Meta;

const startItem = <div>start</div>;
const contentItems = (
  <>
    <div>
      content
      <br />
      content line 2
    </div>
    <div>
      content item 2
      <br />
      content item 2 line 2
      <br />
      content item 2 line 3
    </div>
  </>
);

const endItem = <div>end</div>;

export const Default = {
  render: (props: any) => {
    return (
      <div className="flex-default-story">
        <FlexItem {...props} start={startItem} end={endItem}>
          {contentItems}
        </FlexItem>
      </div>
    );
  },
};
