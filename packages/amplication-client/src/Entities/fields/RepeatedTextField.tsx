import React, { useCallback, useMemo } from "react";
import { useField } from "formik";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

type Option = { label: string; value: string };

export const RepeatedTextField = (props: any) => {
  const [field, , { setValue }] = useField<string[]>(props);

  const handleChange = useCallback(
    (selected) => {
      // React Select emits values instead of event onChange
      if (!selected) {
        setValue([]);
      } else {
        const values = selected.map((option: Option) => option.value);
        setValue(values);
      }
    },
    [setValue]
  );

  const options = useMemo(() => {
    if (props.enum) {
      return props.enum.map((value: string) => ({ value, label: value }));
    }
    return [];
  }, [props.enum]);

  const value = useMemo(() => {
    const values = field.value || [];
    return values.map((value) => ({ value, label: value }));
  }, [field]);

  if (props.enum) {
    return (
      <Select
        {...field}
        {...props}
        isMulti
        isClearable
        value={value}
        onChange={handleChange}
        options={options}
      />
    );
  }

  return (
    <CreatableSelect
      {...field}
      {...props}
      isMulti
      isClearable
      value={value}
      onChange={handleChange}
    />
  );
};
