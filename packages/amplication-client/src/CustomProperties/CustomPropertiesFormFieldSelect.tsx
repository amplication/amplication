import { SelectField } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";

type Props = {
  property: CustomProperty;
  fieldNamePrefix?: string;
  disabled: boolean;
};

function CustomPropertiesFormFieldSelect({
  property,
  fieldNamePrefix,
  disabled,
}: Props) {
  const options = property.options?.map((option) => ({
    value: option.value,
    label: option.value,
    color: option.color,
  }));

  return (
    <SelectField
      disabled={disabled}
      label={property.name}
      name={`${fieldNamePrefix}properties.${property.key}`}
      options={options || []}
    />
  );
}

export default CustomPropertiesFormFieldSelect;
