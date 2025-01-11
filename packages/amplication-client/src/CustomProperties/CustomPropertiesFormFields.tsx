import { useAppContext } from "../context/appContext";
import CustomPropertiesFormField from "./CustomPropertiesFormField";

type Props = {
  disabled: boolean;
};

function CustomPropertiesFormFields({ disabled }: Props) {
  const { customPropertiesMap } = useAppContext();

  return (
    <>
      {Object.values(customPropertiesMap).map((customProperty) => (
        <CustomPropertiesFormField
          disabled={disabled}
          key={customProperty.key}
          property={customProperty}
          fieldNamePrefix=""
        />
      ))}
    </>
  );
}

export default CustomPropertiesFormFields;
