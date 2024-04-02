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
import Creatable from "react-select/creatable";
import { OptionItem } from "../types";
import { LABEL_CLASS, LABEL_VALUE_CLASS } from "../constants";
import { Props as InputToolTipProps } from "../InputTooltip/InputTooltip";

import "./SelectField.scss";
import { Label } from "../Label/Label";

export type Props = {
  label: string;
  name: string;
  options: OptionItem[];
  isMulti?: boolean;
  isClearable?: boolean;
  isCreatable?: boolean;
  disabled?: boolean;
  inputToolTip?: InputToolTipProps | undefined;
};

export const SelectField = ({
  label,
  name,
  options,
  isMulti,
  isClearable,
  isCreatable,
  disabled,
  inputToolTip,
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

    if (isCreatable && isMulti && Array.isArray(values)) {
      const currOptions = options.filter((option) =>
        values.includes(option.value)
      );
      const newOptions = values
        .filter((value) => !options.find((option) => option.value === value))
        .map((value) => ({ value, label: value }));

      return [...currOptions, ...newOptions];
    }

    return isMulti
      ? options.filter((option) => values.includes(option.value))
      : options.find((option) => option.value === values);
  }, [field, isMulti, options, isCreatable]);

  const groupedOptions = useMemo(() => {
    if (!options || options.length === 0) {
      return [];
    }
    if (!options[0].group) {
      return options;
    }

    options.sort((a, b) => a.label.localeCompare(b.label));

    const optionsWithGroups = options.reduce((acc, option) => {
      const group = option.group || "Other";
      acc[group] = acc[group] || [];
      acc[group].push(option);
      return acc;
    }, {} as { [key: string]: OptionItem[] });

    return Object.entries(optionsWithGroups)
      .map(([label, options]) => ({
        label,
        options,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [options]);

  return (
    <div
      className={classNames("select-field", {
        "select-field--has-error": meta.error,
      })}
    >
      <label className={LABEL_CLASS}>
        <Label text={label} inputToolTip={inputToolTip} />
        {isCreatable ? (
          <Creatable
            components={
              options?.length
                ? { Option: CustomOption }
                : { DropdownIndicator: null }
            }
            className="select-field__container"
            classNamePrefix="select-field"
            {...field}
            isMulti={isMulti}
            isClearable={isClearable}
            value={value}
            onChange={handleChange}
            options={groupedOptions}
            isDisabled={disabled}
          />
        ) : (
          <Select
            components={{ Option: CustomOption }}
            className="select-field__container"
            classNamePrefix="select-field"
            {...field}
            isMulti={isMulti}
            isClearable={isClearable}
            value={value}
            onChange={handleChange}
            options={groupedOptions}
            isDisabled={disabled}
          />
        )}
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
