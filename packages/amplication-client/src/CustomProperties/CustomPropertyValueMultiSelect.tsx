import {
  EnumGapSize,
  EnumItemsAlign,
  FlexItem,
} from "@amplication/ui/design-system";
import { CustomProperty } from "../models";
import CustomPropertyValueSelect from "./CustomPropertyValueSelect";

type Props = {
  property: CustomProperty;
  value: string;
};

function CustomPropertyValueMultiSelect({ property, value }: Props) {
  const isArray = Array.isArray(value);

  return !isArray ? (
    <CustomPropertyValueSelect property={property} value={value} />
  ) : (
    <FlexItem itemsAlign={EnumItemsAlign.Center} gap={EnumGapSize.Small}>
      {(value as unknown as string[]).map((itemValue, index) => (
        <CustomPropertyValueSelect
          property={property}
          value={itemValue}
          key={index}
        />
      ))}
    </FlexItem>
  );
}

export default CustomPropertyValueMultiSelect;
