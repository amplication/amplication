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
import { EnumOutdatedVersionAlertStatus } from "../models";
import { useMemo } from "react";
import OutdatedVersionAlertStatus from "./OutdatedVersionAlertStatus";

const CLASS_NAME = "alert-status-filter";

type AlertStatusFilterOption =
  | keyof typeof EnumOutdatedVersionAlertStatus
  | null;

type Props = {
  onChange: (value: AlertStatusFilterOption) => void;
  selectedValue: AlertStatusFilterOption;
};

const OPTIONS: { value: AlertStatusFilterOption; label: string }[] = [
  { value: null, label: "All" },
  { value: EnumOutdatedVersionAlertStatus.New, label: "Active" },
  { value: EnumOutdatedVersionAlertStatus.Resolved, label: "Resolved" },
  { value: EnumOutdatedVersionAlertStatus.Ignored, label: "Ignored" },
  { value: EnumOutdatedVersionAlertStatus.Canceled, label: "Canceled" },
];

export const AlertStatusFilter = ({ selectedValue, onChange }: Props) => {
  const selectedOption = useMemo(() => {
    return OPTIONS.find((option) => option.value === selectedValue);
  }, [selectedValue]);

  return (
    <SelectMenu
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
