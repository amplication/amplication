import {
  Button,
  EnumButtonStyle,
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
import "./DataGridFilter.scss";

const CLASS_NAME = "data-grid-filter";

type Props = {
  filterKey: string;
  filterLabel: string;
  options: OptionItem[];
  onChange: (filterKey: string, value: string | null) => void;
  onRemove: (filterKey: string) => void;
  selectedValue: string;
  disabled?: boolean;
};

export const DataGridFilter = ({
  filterKey,
  filterLabel,
  options,
  selectedValue,
  onChange,
  onRemove,
  disabled,
}: Props) => {
  const selectedItem = useMemo(() => {
    return options.find((option) => option.value === selectedValue);
  }, [options, selectedValue]);

  return (
    <div className={CLASS_NAME}>
      {!disabled && (
        <Button
          className={`${CLASS_NAME}__remove`}
          buttonStyle={EnumButtonStyle.Text}
          icon="close"
          onClick={() => {
            onRemove(filterKey);
          }}
        ></Button>
      )}
      <SelectMenu
        disabled={disabled}
        open
        title={
          <FlexItem gap={EnumGapSize.Small} itemsAlign={EnumItemsAlign.Center}>
            <Text
              textColor={EnumTextColor.Black20}
              textStyle={EnumTextStyle.Tag}
            >
              {filterLabel}
            </Text>
            {!selectedItem ? (
              <span className={`${CLASS_NAME}__show-all`}>All</span>
            ) : (
              <span className={`${CLASS_NAME}__show-all`}>
                {selectedItem.label}
              </span>
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
              onSelectionChange={() => onChange(filterKey, null)}
            >
              All
            </SelectMenuItem>
            {options.map((option) => (
              <SelectMenuItem
                closeAfterSelectionChange
                key={option.value}
                selected={option.value === selectedValue}
                onSelectionChange={() => onChange(filterKey, option.value)}
              >
                {option.label}
              </SelectMenuItem>
            ))}
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
};
