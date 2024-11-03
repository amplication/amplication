import {
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  OptionItem,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { useMemo } from "react";
import { EnumButtonStyle } from "../Components/Button";
import { CustomProperty } from "../models";
import CustomPropertyValueSelect from "./CustomPropertyValueSelect";
import "./CustomPropertyFilter.scss";

const CLASS_NAME = "custom-property-filter";

type Props = {
  customProperty: CustomProperty;
  onChange: (propertyKey: string, value: string) => void;
  selectedValue: string;
};

export const CustomPropertyFilter = ({
  customProperty,
  selectedValue,
  onChange,
}: Props) => {
  const options = useMemo(() => {
    return customProperty.options.map(
      (option): OptionItem => ({
        value: option.value,
        label: option.value,
        color: option.color,
      })
    );
  }, [customProperty.options]);

  return (
    <div className={CLASS_NAME}>
      <SelectMenu
        title={
          <FlexItem gap={EnumGapSize.Small} itemsAlign={EnumItemsAlign.Center}>
            <Text
              textColor={EnumTextColor.Black20}
              textStyle={EnumTextStyle.Tag}
            >
              {customProperty.name}
            </Text>
            {null === selectedValue ? (
              <span className={`${CLASS_NAME}__show-all`}>All</span>
            ) : (
              <CustomPropertyValueSelect
                property={customProperty}
                value={selectedValue}
              />
            )}
          </FlexItem>
        }
        buttonStyle={EnumButtonStyle.Text}
      >
        <SelectMenuModal>
          <SelectMenuList>
            <SelectMenuItem
              closeAfterSelectionChange
              selected={null === selectedValue}
              onSelectionChange={() => onChange(customProperty.key, null)}
            >
              All
            </SelectMenuItem>
            {options.map((option) => (
              <SelectMenuItem
                closeAfterSelectionChange
                key={option.value}
                selected={option.value === selectedValue}
                onSelectionChange={() =>
                  onChange(customProperty.key, option.value)
                }
              >
                <CustomPropertyValueSelect
                  property={customProperty}
                  value={option.value}
                />
              </SelectMenuItem>
            ))}
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
};
