import React, { useCallback, useMemo } from "react";
import { useField, ErrorMessage } from "formik";
import { Icon } from "@rmwc/icon";
import classNames from "classnames";

import Select, { OptionProps, OptionTypeBase, components } from "react-select";
import "./SelectField.scss";

type OptionItem = {
  value: string | null;
  label: string;
  icon?: string;
};

export type Props = {
  label: string;
  name: string;
  options: OptionItem[];
  isMulti?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
};

type Option = { label: string; value: string | null };

export const SelectField = ({
  label,
  name,
  options,
  isMulti,
  isClearable,
  disabled,
}: Props) => {
  const [field, meta, { setValue }] = useField<string | string[]>(name);

  const handleChange = useCallback(
    (selected) => {
      // React Select emits values instead of event onChange
      if (!selected) {
        setValue([]);
      } else {
        const values = isMulti
          ? selected.map((option: Option) => option.value)
          : selected.value;
        setValue(values);
      }
    },
    [setValue, isMulti]
  );

  const value = useMemo(() => {
    const values = field.value || [];

    return isMulti
      ? options.filter((option) => values.includes(option.value))
      : options.find((option) => option.value === values);
  }, [field, isMulti, options]);

  return (
    <div
      className={classNames("select-field", {
        "select-field--has-error": meta.error,
      })}
    >
      <label>
        {label}
        <Select
          components={{ Option: CustomOption }}
          className="select-field__container"
          classNamePrefix="select-field"
          {...field}
          isMulti={isMulti}
          isClearable={isClearable}
          // @ts-ignore
          value={value}
          onChange={handleChange}
          options={options}
          isDisabled={disabled}
        />
      </label>
      <ErrorMessage name={name} component="div" className="text-input__error" />
    </div>
  );
};

const CustomOption = ({ children, ...props }: OptionProps<OptionTypeBase>) => {
  const icon = (props.data as OptionItem).icon;

  return (
    <components.Option {...props}>
      {icon && <Icon icon={icon} />}
      {children}
    </components.Option>
  );
};
