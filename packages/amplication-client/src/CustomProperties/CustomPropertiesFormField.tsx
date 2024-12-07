import { CustomProperty, EnumCustomPropertyType } from "../models";
import CustomPropertiesFormFieldLink from "./CustomPropertiesFormFieldLink";
import CustomPropertiesFormFieldMultiSelect from "./CustomPropertiesFormFieldMultiSelect";
import CustomPropertiesFormFieldSelect from "./CustomPropertiesFormFieldSelect";
import CustomPropertiesFormFieldText from "./CustomPropertiesFormFieldText";

type Props = {
  property: CustomProperty;
  fieldNamePrefix?: string;
};

function CustomPropertiesFormField({ property, fieldNamePrefix }: Props) {
  const prefix = fieldNamePrefix || "";

  if (property.type === EnumCustomPropertyType.Text) {
    return (
      <CustomPropertiesFormFieldText
        property={property}
        fieldNamePrefix={prefix}
      />
    );
  }

  if (property.type === EnumCustomPropertyType.Link) {
    return (
      <CustomPropertiesFormFieldLink
        property={property}
        fieldNamePrefix={prefix}
      />
    );
  }

  if (property.type === EnumCustomPropertyType.Select) {
    return (
      <CustomPropertiesFormFieldSelect
        property={property}
        fieldNamePrefix={prefix}
      />
    );
  }

  if (property.type === EnumCustomPropertyType.MultiSelect) {
    return (
      <CustomPropertiesFormFieldMultiSelect
        property={property}
        fieldNamePrefix={prefix}
      />
    );
  }

  return null;
}

export default CustomPropertiesFormField;
