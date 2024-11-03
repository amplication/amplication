import { List } from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import * as models from "../../models";
import CustomPropertyOption from "./CustomPropertyOption";
import NewCustomPropertyOption from "./NewCustomPropertyOption";

type Props = {
  customProperty: models.CustomProperty;
  onOptionDelete?: (option: models.CustomPropertyOption) => void;
  onOptionAdd?: (option: models.CustomProperty) => void;
};
const CustomPropertyOptionList = React.memo(
  ({ customProperty, onOptionDelete, onOptionAdd }: Props) => {
    const onPropertyOptionChanged = useCallback(() => {
      onOptionAdd && onOptionAdd(customProperty);
    }, [customProperty, onOptionAdd]);

    return (
      <>
        <List
          headerContent={
            <NewCustomPropertyOption
              customProperty={customProperty}
              onOptionAdd={onOptionAdd}
            />
          }
        >
          {customProperty?.options?.map((property, index) => (
            <CustomPropertyOption
              key={index}
              customProperty={customProperty}
              customPropertyOption={property}
              onOptionChanged={onPropertyOptionChanged}
              onOptionDelete={onOptionDelete}
            />
          ))}
        </List>
      </>
    );
  }
);

export default CustomPropertyOptionList;
