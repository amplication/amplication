import { useField } from "formik";
import React, { useCallback } from "react";
import { Props as SelectPanelProps, SelectPanel } from "./SelectPanel";
import { EnumButtonStyle } from "../Button/Button";

export type Props = Omit<SelectPanelProps, "selectedValue" | "onChange"> & {
  name: string;
  label: string;
  onChange?: (selectedValue: string | string[] | null) => void;
};

export const SelectPanelField: React.FC<Props> = ({
  label,
  name,
  onChange,
  ...props
}) => {
  const [field, , { setValue }] = useField<string | string[] | null>(name);

  const handleChange = useCallback(
    (selectedValue: string | string[] | null) => {
      setValue(selectedValue);
      onChange?.(selectedValue);
    },
    [setValue, onChange]
  );

  return (
    <div
      className="select-panel-field"
      style={{ width: "100%", marginBottom: "var(--default-spacing-small)" }}
    >
      <SelectPanel
        {...props}
        label={label}
        onChange={handleChange}
        selectedValue={field.value}
        showAsSelectField={true}
        buttonProps={{
          buttonStyle: EnumButtonStyle.Text,
        }}
      />
    </div>
  );
};
