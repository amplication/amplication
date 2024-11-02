import { SelectField } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";

type Props = {
  property: CustomProperty;
};

function CustomPropertiesFormFieldSelect({ property }: Props) {
  const options = property.options?.map((option) => ({
    value: option.value,
    label: option.value,
  }));

  return (
    <SelectField
      label={property.name}
      name={`properties.${property.key}`}
      options={options || []}
    />
  );
}

export default CustomPropertiesFormFieldSelect;
