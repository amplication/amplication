import { SelectPanelField } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";
import { useMemo } from "react";

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
  const options = useMemo(() => {
    const items = property.options?.map((option) => ({
      value: option.value,
      label: option.value,
      color: option.color,
    }));

    return items;
  }, [property]);

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
      label={property.name}
      name={`${fieldNamePrefix}properties.${property.key}`}
      options={options || []}
    />
  );
}

export default CustomPropertiesFormFieldSelect;
