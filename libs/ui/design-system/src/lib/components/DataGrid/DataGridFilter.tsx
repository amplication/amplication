import {
  Button,
  EnumButtonStyle,
  OptionItem,
  SelectPanel,
} from "@amplication/ui/design-system";
import "./DataGridFilter.scss";

const CLASS_NAME = "data-grid-filter";

type Props = {
  filterKey: string;
  filterLabel: string;
  options: OptionItem[];
  onChange: (filterKey: string, value: string | string[] | null) => void;
  onRemove: (filterKey: string) => void;
  selectedValue: string | string[] | null;
  disabled?: boolean;
  isMulti?: boolean;
  showEmptyItem?: boolean;
  emptyItemLabel?: string;
};

export const DataGridFilter = ({
  filterKey,
  filterLabel,
  options,
  selectedValue,
  onChange,
  onRemove,
  disabled,
  isMulti,
  showEmptyItem,
  emptyItemLabel,
}: Props) => {
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
      <SelectPanel
        label={filterLabel}
        options={options}
        showEmptyItem={showEmptyItem}
        emptyItemLabel={emptyItemLabel}
        selectedValue={selectedValue}
        onChange={(value) => onChange(filterKey, value)}
        disabled={disabled}
        isMulti={isMulti}
        buttonProps={{
          buttonStyle: EnumButtonStyle.Text,
        }}
      />
    </div>
  );
};
