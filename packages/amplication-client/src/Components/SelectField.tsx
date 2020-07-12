import React, { useCallback, useMemo } from "react";
import { useField } from "formik";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import "./SelectField.scss";

type optionItem = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  name: string;
  options: optionItem[];
  allowCreate?: boolean;
  isMulti?: boolean;
  isClearable?: boolean;
};

type Option = { label: string; value: string };

export const SelectField = ({
  label,
  name,
  options,
  allowCreate = false,
  isMulti = false,
  isClearable = false,
}: Props) => {
  const [field, , { setValue }] = useField<string[]>(name);

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
      ? values.map((value) => ({ value, label: value }))
      : { value: values, label: values };
  }, [field, isMulti]);

  if (!allowCreate) {
    return (
      <div className="select-field">
        <label>
          {label}
          <Select
            className="select-field__container"
            classNamePrefix="select-field"
            {...field}
            isMulti={isMulti}
            isClearable={isClearable}
            // @ts-ignore
            value={value}
            onChange={handleChange}
            options={options}
          />
        </label>
      </div>
    );
  }

  return (
    <div className="select-field">
      <label>
        {label}
        <CreatableSelect
          {...field}
          isMulti={isMulti}
          isClearable={isClearable}
          // @ts-ignore
          value={value}
          onChange={handleChange}
        />
      </label>
    </div>
  );
};
