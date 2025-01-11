import {
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { EnumButtonStyle } from "../Components/Button";
import { EnumOutdatedVersionAlertType } from "../models";
import { useMemo } from "react";
import OutdatedVersionAlertType from "./OutdatedVersionAlertType";

const CLASS_NAME = "alert-type-filter";

type AlertTypeFilterOption = keyof typeof EnumOutdatedVersionAlertType | null;

type Props = {
  onChange: (value: AlertTypeFilterOption) => void;
  selectedValue: AlertTypeFilterOption;
};

const OPTIONS: { value: AlertTypeFilterOption; label: string }[] = [
  { value: null, label: "All" },
  { value: "TemplateVersion", label: "Template" },
  { value: "PluginVersion", label: "Plugin" },
  { value: "CodeEngineVersion", label: "Code Engine" },
];

export const AlertTypeFilter = ({ selectedValue, onChange }: Props) => {
  const selectedOption = useMemo(() => {
    return OPTIONS.find((option) => option.value === selectedValue);
  }, [selectedValue]);

  return (
    <SelectMenu
      className={CLASS_NAME}
      title={
        <FlexItem gap={EnumGapSize.Small} itemsAlign={EnumItemsAlign.Center}>
          <Text textColor={EnumTextColor.Black20} textStyle={EnumTextStyle.Tag}>
            Type
          </Text>
          <OutdatedVersionAlertType
            hideTooltip
            type={selectedOption.value}
          ></OutdatedVersionAlertType>
        </FlexItem>
      }
      buttonStyle={EnumButtonStyle.Text}
    >
      <SelectMenuModal>
        <SelectMenuList>
          {OPTIONS.map((option) => (
            <SelectMenuItem
              closeAfterSelectionChange
              key={option.value}
              selected={option.value === selectedValue}
              onSelectionChange={() => onChange(option.value)}
            >
              <OutdatedVersionAlertType
                hideTooltip
                type={option.value}
              ></OutdatedVersionAlertType>
            </SelectMenuItem>
          ))}
        </SelectMenuList>
      </SelectMenuModal>
    </SelectMenu>
  );
};
