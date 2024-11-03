import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";

type Props = {
  property: CustomProperty;
  value: string;
};

function CustomPropertyValueText({ property, value }: Props) {
  return <Text textStyle={EnumTextStyle.Description}>{value}</Text>;
}

export default CustomPropertyValueText;
