import {
  EnumContentAlign,
  EnumFlexDirection,
  EnumItemsAlign,
  FlexItem,
} from "../FlexItem/FlexItem";
import { EnumTextColor, EnumTextStyle, Text } from "../Text/Text";
import { Toggle } from "./Toggle";
import "./ToggleView.scss";

const CLASS_NAME = "amp-toggle-view";

export type Props = {
  values: [string, string];
  selectedValue: string;
  onValueChange: (selectedValue: string) => void;
};

export const ToggleView = (props: Props) => {
  const { values, onValueChange, selectedValue } = props;

  return (
    <FlexItem
      className={CLASS_NAME}
      direction={EnumFlexDirection.Row}
      contentAlign={EnumContentAlign.Center}
      itemsAlign={EnumItemsAlign.Center}
    >
      <Text
        textStyle={EnumTextStyle.Tag}
        textColor={
          selectedValue === values[0]
            ? EnumTextColor.White
            : EnumTextColor.Black20
        }
      >
        {values[0]}
      </Text>
      <div className={`${CLASS_NAME}__view-toggle`}>
        <Toggle
          value={selectedValue === values[1]}
          defaultChecked={selectedValue === values[1]}
          onValueChange={(isView1) =>
            onValueChange(isView1 ? values[1] : values[0])
          }
        />
      </div>
      <Text
        textStyle={EnumTextStyle.Tag}
        textColor={
          selectedValue === values[1]
            ? EnumTextColor.White
            : EnumTextColor.Black20
        }
      >
        {values[1]}
      </Text>
    </FlexItem>
  );
};
