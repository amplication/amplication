import { useField, ErrorMessage } from "formik";
import React, { useCallback } from "react";
import { Props as SelectPanelProps, SelectPanel } from "./SelectPanel";
import { EnumButtonStyle } from "../Button/Button";
import classNames from "classnames";
import "./SelectPanelField.scss";

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
  const [field, meta, { setValue }] = useField<string | string[] | null>(name);

  const handleChange = useCallback(
    (selectedValue: string | string[] | null) => {
      setValue(selectedValue);
      onChange?.(selectedValue);
    },
    [setValue, onChange]
  );

  return (
    <div
      className={classNames("select-panel-field", {
        "select-panel-field--has-error": meta.error && meta.touched,
      })}
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
      <ErrorMessage name={name} component="div" className="text-input__error" />
    </div>
  );
};
