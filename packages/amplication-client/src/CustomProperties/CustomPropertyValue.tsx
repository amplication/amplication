import { JsonValue } from "type-fest";
import { useAppContext } from "../context/appContext";
import { CustomProperty, EnumCustomPropertyType } from "../models";
import CustomPropertyValueLink from "./CustomPropertyValueLink";
import CustomPropertyValueMultiSelect from "./CustomPropertyValueMultiSelect";
import CustomPropertyValueSelect from "./CustomPropertyValueSelect";
import CustomPropertyValueText from "./CustomPropertyValueText";

type Props = {
  propertyKey: string;
  allValues: JsonValue;
  propertiesMap?: Record<string, CustomProperty>; //when used for blueprint properties, the map can be passed to avoid fetching it per value
};

function CustomPropertyValue({ propertyKey, allValues, propertiesMap }: Props) {
  const { customPropertiesMap } = useAppContext();

  const property = propertiesMap
    ? propertiesMap[propertyKey]
    : customPropertiesMap[propertyKey];

  if (!property) {
    return null;
  }

  const value = allValues ? allValues[propertyKey] : undefined;

  if (property.type === EnumCustomPropertyType.Text) {
    return <CustomPropertyValueText property={property} value={value} />;
  }

  if (property.type === EnumCustomPropertyType.Link) {
    return <CustomPropertyValueLink property={property} value={value} />;
  }

  if (property.type === EnumCustomPropertyType.Select) {
    return <CustomPropertyValueSelect property={property} value={value} />;
  }

  if (property.type === EnumCustomPropertyType.MultiSelect) {
    return <CustomPropertyValueMultiSelect property={property} value={value} />;
  }

  return null;
}

export default CustomPropertyValue;
