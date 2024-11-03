import { TextField } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";
import { CLASS_NAME } from "./CustomPropertiesFormFields";

type Props = {
  property: CustomProperty;
};

function CustomPropertiesFormFieldText({ property }: Props) {
  return (
    <TextField
      className={`${CLASS_NAME}__field__text`}
      label={property.name}
      name={`properties.${property.key}`}
    />
  );
}

export default CustomPropertiesFormFieldText;
