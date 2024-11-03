import { EnumTextStyle, Text } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";
import "./CustomPropertyValueLink.scss";

type Props = {
  property: CustomProperty;
  value: string;
};
const CLASS_NAME = "custom-property-value-link";

function CustomPropertyValueLink({ property, value }: Props) {
  return (
    <a href={value} target="blank" className={CLASS_NAME}>
      <Text textStyle={EnumTextStyle.Tag}>{value}</Text>
    </a>
  );
}

export default CustomPropertyValueLink;
