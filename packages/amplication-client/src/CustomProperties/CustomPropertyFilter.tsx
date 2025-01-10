import {
  Button,
  DataGridRenderFilterProps,
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
import { useAppContext } from "../context/appContext";
import "./CustomPropertyFilter.scss";
import CustomPropertyValueSelect from "./CustomPropertyValueSelect";

const CLASS_NAME = "custom-property-filter";

export const CustomPropertyFilter = ({
  columnKey,
  selectedValue,
  onChange,
  onRemove,
}: DataGridRenderFilterProps) => {
  const { customPropertiesMap } = useAppContext();
  const customProperty = customPropertiesMap[columnKey];

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
      <Button
        buttonStyle={EnumButtonStyle.Text}
        icon="close"
        onClick={() => {
          onRemove(customProperty.key);
        }}
      ></Button>
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
                value={selectedValue as string}
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
