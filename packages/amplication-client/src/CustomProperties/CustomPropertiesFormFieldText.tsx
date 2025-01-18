import { TextField } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";

type Props = {
  property: CustomProperty;
  fieldNamePrefix?: string;
  disabled: boolean;
};

function CustomPropertiesFormFieldText({
  property,
  fieldNamePrefix,
  disabled,
}: Props) {
  return (
    <TextField
      disabled={disabled}
      inputToolTip={
        property.description
          ? {
              content: property.description,
            }
          : undefined
      }
      label={property.name}
      name={`${fieldNamePrefix}properties.${property.key}`}
    />
  );
}

export default CustomPropertiesFormFieldText;
