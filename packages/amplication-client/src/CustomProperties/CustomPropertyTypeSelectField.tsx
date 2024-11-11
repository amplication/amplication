import { SelectField, SelectFieldProps } from "@amplication/ui/design-system";
import { EnumCustomPropertyType } from "../models";
import { CUSTOM_PROPERTY_TYPE_TO_LABEL_AND_ICON } from "./CustomPropertyList";

type Props = Omit<SelectFieldProps, "options">;

const OPTIONS = [
  {
    label: "Select",
    value: EnumCustomPropertyType.Select,
    icon: CUSTOM_PROPERTY_TYPE_TO_LABEL_AND_ICON[EnumCustomPropertyType.Select]
      .icon,
  },
  {
    label: "Multi Select",
    value: EnumCustomPropertyType.MultiSelect,
    icon: CUSTOM_PROPERTY_TYPE_TO_LABEL_AND_ICON[
      EnumCustomPropertyType.MultiSelect
    ].icon,
  },
  {
    label: "Text",
    value: EnumCustomPropertyType.Text,
    icon: CUSTOM_PROPERTY_TYPE_TO_LABEL_AND_ICON[EnumCustomPropertyType.Text]
      .icon,
  },

  {
    label: "Link",
    value: EnumCustomPropertyType.Link,
    icon: CUSTOM_PROPERTY_TYPE_TO_LABEL_AND_ICON[EnumCustomPropertyType.Link]
      .icon,
  },
];

const CustomPropertyTypeSelectField = ({ ...props }: Props) => {
  return <SelectField {...props} options={OPTIONS} />;
};

export default CustomPropertyTypeSelectField;
