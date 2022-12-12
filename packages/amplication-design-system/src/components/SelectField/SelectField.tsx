import React, { useCallback, useMemo } from "react";
import { useField, ErrorMessage } from "formik";
import { Icon } from "../Icon/Icon";
import classNames from "classnames";

import Select, {
  OptionProps,
  GroupBase,
  MultiValue,
  SingleValue,
} from "react-select";
import { OptionItem } from "../types";
import { LABEL_CLASS, LABEL_VALUE_CLASS } from "../constants";

import "./SelectField.scss";

export type Props = {
  label: string;
  name: string;
  options: OptionItem[];
  isMulti?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
};

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
    (selected: MultiValue<OptionItem> | SingleValue<OptionItem>) => {
      // React Select emits values instead of event onChange
      if (!selected) {
        setValue([]);
      } else {
        const values = isMulti
          ? (selected as OptionItem[]).map((option: OptionItem) => option.value)
          : (selected as OptionItem).value;
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
      <label className={LABEL_CLASS}>
        <span className={LABEL_VALUE_CLASS}>{label}</span>
        <Select
          components={{ Option: CustomOption }}
          className="select-field__container"
          classNamePrefix="select-field"
          {...field}
          isMulti={isMulti}
          isClearable={isClearable}
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

const CustomOption = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: OptionProps<Option, IsMulti, Group>
) => {
  const {
    children,
    className,
    cx,
    isDisabled,
    isFocused,
    isSelected,
    innerRef,
    innerProps,
    data,
  } = props;

  const icon = (data as unknown as OptionItem).icon;

  return (
    <div
      className={cx(
        {
          option: true,
          "option--is-disabled": isDisabled,
          "option--is-focused": isFocused,
          "option--is-selected": isSelected,
        },
        className
      )}
      ref={innerRef}
      aria-disabled={isDisabled}
      {...innerProps}
    >
      {icon && <Icon icon={icon} />}
      {children}
    </div>
  );
};
