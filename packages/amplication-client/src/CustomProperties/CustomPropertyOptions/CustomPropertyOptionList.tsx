import { List } from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import * as models from "../../models";
import CustomPropertyOption from "./CustomPropertyOption";
import NewCustomPropertyOption from "./NewCustomPropertyOption";

type Props = {
  customProperty: models.CustomProperty;
  onOptionDelete?: (option: models.CustomPropertyOption) => void;
  onOptionAdd?: (option: models.CustomProperty) => void;
  disabled?: boolean;
};
const CustomPropertyOptionList = React.memo(
  ({ customProperty, onOptionDelete, onOptionAdd, disabled }: Props) => {
    const onPropertyOptionChanged = useCallback(() => {
      onOptionAdd && onOptionAdd(customProperty);
    }, [customProperty, onOptionAdd]);

    return (
      <>
        <List
          headerContent={
            !disabled && (
              <NewCustomPropertyOption
                customProperty={customProperty}
                onOptionAdd={onOptionAdd}
                disabled={disabled}
              />
            )
          }
        >
          {customProperty?.options?.map((property, index) => (
            <CustomPropertyOption
              key={index}
              customProperty={customProperty}
              customPropertyOption={property}
              onOptionChanged={onPropertyOptionChanged}
              onOptionDelete={onOptionDelete}
              disabled={disabled}
            />
          ))}
        </List>
      </>
    );
  }
);

export default CustomPropertyOptionList;
