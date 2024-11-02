import { SelectField } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";

type Props = {
  property: CustomProperty;
};

function CustomPropertiesFormFieldMultiSelect({ property }: Props) {
  const options = property.options?.map((option) => ({
    value: option.value,
    label: option.value,
    color: option.color,
  }));

  return (
    <SelectField
      isMulti
      label={property.name}
      name={`properties.${property.key}`}
      options={options || []}
    />
  );
}

export default CustomPropertiesFormFieldMultiSelect;
