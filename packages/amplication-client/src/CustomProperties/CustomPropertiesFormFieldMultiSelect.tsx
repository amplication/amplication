import { SelectPanelField } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";

type Props = {
  property: CustomProperty;
  fieldNamePrefix?: string;
  disabled: boolean;
};

function CustomPropertiesFormFieldMultiSelect({
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
    <SelectPanelField
      inputToolTip={
        property.description
          ? {
              content: property.description,
            }
          : undefined
      }
      disabled={disabled}
      isMulti
      label={property.name}
      name={`${fieldNamePrefix}properties.${property.key}`}
      options={options || []}
    />
  );
}

export default CustomPropertiesFormFieldMultiSelect;
