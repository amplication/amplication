import { useAppContext } from "../context/appContext";
import CustomPropertiesFormField from "./CustomPropertiesFormField";

function CustomPropertiesFormFields() {
  const { customPropertiesMap } = useAppContext();

  return (
    <>
      {Object.values(customPropertiesMap).map((customProperty) => (
        <CustomPropertiesFormField
          key={customProperty.key}
          property={customProperty}
          fieldNamePrefix=""
        />
      ))}
    </>
  );
}

export default CustomPropertiesFormFields;
