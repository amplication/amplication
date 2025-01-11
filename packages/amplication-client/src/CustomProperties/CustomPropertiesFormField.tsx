import { CustomProperty, EnumCustomPropertyType } from "../models";
import CustomPropertiesFormFieldLink from "./CustomPropertiesFormFieldLink";
import CustomPropertiesFormFieldMultiSelect from "./CustomPropertiesFormFieldMultiSelect";
import CustomPropertiesFormFieldSelect from "./CustomPropertiesFormFieldSelect";
import CustomPropertiesFormFieldText from "./CustomPropertiesFormFieldText";

type Props = {
  property: CustomProperty;
  fieldNamePrefix?: string;
  disabled: boolean;
};

function CustomPropertiesFormField({
  property,
  fieldNamePrefix,
  disabled,
}: Props) {
  const prefix = fieldNamePrefix || "";

  if (property.type === EnumCustomPropertyType.Text) {
    return (
      <CustomPropertiesFormFieldText
        disabled={disabled}
        property={property}
        fieldNamePrefix={prefix}
      />
    );
  }

  if (property.type === EnumCustomPropertyType.Link) {
    return (
      <CustomPropertiesFormFieldLink
        disabled={disabled}
        property={property}
        fieldNamePrefix={prefix}
      />
    );
  }

  if (property.type === EnumCustomPropertyType.Select) {
    return (
      <CustomPropertiesFormFieldSelect
        disabled={disabled}
        property={property}
        fieldNamePrefix={prefix}
      />
    );
  }

  if (property.type === EnumCustomPropertyType.MultiSelect) {
    return (
      <CustomPropertiesFormFieldMultiSelect
        disabled={disabled}
        property={property}
        fieldNamePrefix={prefix}
      />
    );
  }

  return null;
}

export default CustomPropertiesFormField;
