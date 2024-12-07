import { EnumFlexItemMargin, FlexItem } from "@amplication/ui/design-system";
import { useAppContext } from "../context/appContext";
import CustomPropertiesFormField from "./CustomPropertiesFormField";

export const CLASS_NAME = "custom-properties-form-fields";

function CustomPropertiesFormFields() {
  const { customPropertiesMap } = useAppContext();

  return (
    <div className={CLASS_NAME}>
      {Object.values(customPropertiesMap).map((customProperty) => (
        <CustomPropertiesFormField
          key={customProperty.key}
          property={customProperty}
        />
      ))}
      <FlexItem margin={EnumFlexItemMargin.Both} />
    </div>
  );
}

export default CustomPropertiesFormFields;
