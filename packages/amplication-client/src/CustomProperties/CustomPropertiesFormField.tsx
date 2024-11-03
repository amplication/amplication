import { CustomProperty, EnumCustomPropertyType } from "../models";
import CustomPropertiesFormFieldLink from "./CustomPropertiesFormFieldLink";
import CustomPropertiesFormFieldMultiSelect from "./CustomPropertiesFormFieldMultiSelect";
import CustomPropertiesFormFieldSelect from "./CustomPropertiesFormFieldSelect";
import CustomPropertiesFormFieldText from "./CustomPropertiesFormFieldText";

type Props = {
  property: CustomProperty;
};

function CustomPropertiesFormField({ property }: Props) {
  if (property.type === EnumCustomPropertyType.Text) {
    return <CustomPropertiesFormFieldText property={property} />;
  }

  if (property.type === EnumCustomPropertyType.Link) {
    return <CustomPropertiesFormFieldLink property={property} />;
  }

  if (property.type === EnumCustomPropertyType.Select) {
    return <CustomPropertiesFormFieldSelect property={property} />;
  }

  if (property.type === EnumCustomPropertyType.MultiSelect) {
    return <CustomPropertiesFormFieldMultiSelect property={property} />;
  }

  return null;
}

export default CustomPropertiesFormField;
