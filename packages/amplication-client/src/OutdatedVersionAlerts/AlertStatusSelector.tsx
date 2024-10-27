import {
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { EnumButtonStyle } from "../Components/Button";
import { EnumOutdatedVersionAlertStatus } from "../models";
import { useMemo } from "react";
import OutdatedVersionAlertStatus from "./OutdatedVersionAlertStatus";

const CLASS_NAME = "alert-status-selector";

type Props = {
  onChange: (value: EnumOutdatedVersionAlertStatus) => void;
  selectedValue: EnumOutdatedVersionAlertStatus;
  disabled?: boolean;
};

const OPTIONS: { value: EnumOutdatedVersionAlertStatus; label: string }[] = [
  { value: EnumOutdatedVersionAlertStatus.New, label: "Active" },
  { value: EnumOutdatedVersionAlertStatus.Resolved, label: "Resolved" },
  { value: EnumOutdatedVersionAlertStatus.Ignored, label: "Ignored" },
];

export const AlertStatusSelector = ({
  selectedValue,
  onChange,
  disabled,
}: Props) => {
  const selectedOption = useMemo(() => {
    return OPTIONS.find((option) => option.value === selectedValue);
  }, [selectedValue]);

  return (
    <SelectMenu
      disabled={disabled}
      className={CLASS_NAME}
      title={
        <FlexItem gap={EnumGapSize.Small} itemsAlign={EnumItemsAlign.Center}>
          <Text textColor={EnumTextColor.Black20} textStyle={EnumTextStyle.Tag}>
            Status
          </Text>
          <OutdatedVersionAlertStatus
            hideTooltip
            status={selectedOption.value}
          ></OutdatedVersionAlertStatus>
          <Icon icon="edit_2" />
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
              <OutdatedVersionAlertStatus
                hideTooltip
                status={option.value}
              ></OutdatedVersionAlertStatus>
            </SelectMenuItem>
          ))}
        </SelectMenuList>
      </SelectMenuModal>
    </SelectMenu>
  );
};
