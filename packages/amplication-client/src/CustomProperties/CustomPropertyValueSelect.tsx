import { Tag } from "@amplication/ui/design-system";
import { CustomProperty } from "../models";
import { useMemo } from "react";
import { isEmpty } from "lodash";

type Props = {
  property: CustomProperty;
  value: string;
};

function CustomPropertyValueSelect({ property, value }: Props) {
  const color = useMemo(() => {
    return property.options?.find((option) => option.value === value)?.color;
  }, [property.options, value]);

  if (isEmpty(value)) return null;

  return <Tag value={value} color={color} />;
}

export default CustomPropertyValueSelect;
