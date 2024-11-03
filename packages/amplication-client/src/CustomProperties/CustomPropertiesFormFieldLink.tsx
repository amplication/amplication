import { TextField } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";
import { CLASS_NAME } from "./CustomPropertiesFormFields";

type Props = {
  property: CustomProperty;
};

function CustomPropertiesFormFieldLink({ property }: Props) {
  return (
    <TextField
      className={`${CLASS_NAME}__field__link`}
      label={property.name}
      name={`properties.${property.key}`}
    />
  );
}

export default CustomPropertiesFormFieldLink;
