import { TextField } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";

type Props = {
  property: CustomProperty;
  fieldNamePrefix?: string;
  disabled: boolean;
};

function CustomPropertiesFormFieldLink({
  property,
  fieldNamePrefix,
  disabled,
}: Props) {
  return (
    <TextField
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
    />
  );
}

export default CustomPropertiesFormFieldLink;
