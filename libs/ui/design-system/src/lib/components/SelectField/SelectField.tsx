import classNames from "classnames";
import { ErrorMessage, useField } from "formik";
import { useCallback, useMemo } from "react";
import { Icon } from "../Icon/Icon";

import Select, {
  GroupBase,
  MultiValue,
  MultiValueGenericProps,
  OptionProps,
  SingleValue,
  SingleValueProps,
} from "react-select";
import Creatable from "react-select/creatable";
import { LABEL_CLASS } from "../constants";
import { Props as InputToolTipProps } from "../InputTooltip/InputTooltip";
import { OptionItem } from "../types";

import { Label } from "../Label/Label";
import { Tag } from "../Tag/Tag";
import "./SelectField.scss";

export type Props = {
  label: string;
  name: string;
  options: OptionItem[];
  isMulti?: boolean;
  isClearable?: boolean;
  isCreatable?: boolean;
  disabled?: boolean;
  inputToolTip?: InputToolTipProps | undefined;
  onChange?: (value: string | string[]) => void;
};

export const SelectField = ({
  label,
  name,
  options = [],
  isMulti,
  isClearable,
  isCreatable,
  disabled,
  inputToolTip,
  onChange,
}: Props) => {
  const [field, meta, { setValue }] = useField<string | string[]>(name);

  const handleChange = useCallback(
    (selected: MultiValue<OptionItem> | SingleValue<OptionItem>) => {
      // React Select emits values instead of event onChange
      let newValue;

      if (!selected) {
        newValue = isMulti ? [] : "";
      } else {
        newValue = isMulti
          ? (selected as OptionItem[]).map((option: OptionItem) => option.value)
          : (selected as OptionItem).value;
      }
      setValue(newValue);

      if (onChange) {
        onChange(newValue);
      }
    },
    [onChange, setValue, isMulti]
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
        "select-field--has-error": meta.error && meta.touched,
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
            components={{
              Option: CustomOption,
              MultiValueLabel: CustomMultiValueLabel,
              SingleValue: CustomSingleValue,
            }}
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

const DEFAULT_TAG_COLOR = "var(--gray-base)";
const CustomMultiValueLabel = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: MultiValueGenericProps<Option, IsMulti, Group>
) => {
  const { data, innerProps } = props;

  const color = (data as unknown as OptionItem).color || DEFAULT_TAG_COLOR;
  const label = (data as unknown as OptionItem).label;

  return <Tag {...innerProps} value={label} color={color} />;
};

const CustomSingleValue = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>(
  props: SingleValueProps<Option, IsMulti, Group>
) => {
  const { data, innerProps } = props;

  const color = (data as unknown as OptionItem).color;
  const label = (data as unknown as OptionItem).label;

  return color ? (
    <Tag {...innerProps} value={label} color={color} />
  ) : (
    <div {...innerProps}>{label}</div>
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
  const color = (data as unknown as OptionItem).color;

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
      {color ? (
        <Tag value={children} color={color} />
      ) : (
        <>
          {icon && <Icon icon={icon} />}
          {children}
        </>
      )}
    </div>
  );
};
