import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FieldArray, FieldArrayRenderProps, getIn } from "formik";
import { pascalCase } from "pascal-case";
import { get } from "lodash";

import { Button, EnumButtonStyle } from "../Components/Button";
import { TextField, Icon } from "@amplication/ui/design-system";
import "./OptionSet.scss";

type OptionItem = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  name: string;
  isDisabled?: boolean;
};

const CLASS_NAME = "option-set";

const OptionSet = ({ name, label }: Props) => {
  return (
    <div className={CLASS_NAME}>
      <FieldArray
        name={name}
        validateOnChange
        render={(props) => <OptionSetOptions {...props} label={label} />}
      />
    </div>
  );
};

export default OptionSet;

const OptionSetOptions = ({
  form,
  name,
  remove,
  replace,
  label,
}: {
  label: string;
} & FieldArrayRenderProps) => {
  const value = get(form.values, name) || [];
  const [push, hasNew] = useVirtualPush(value);

  const errors = useMemo(() => {
    const error = getIn(form.errors, name);
    if (typeof error === "string") return error;
    return null;
  }, [form.errors, name]);

  const options = hasNew ? [...value, {}] : value;

  return (
    <div>
      <h3>{label}</h3>
      {errors && <div className="option-set__error-message">{errors}</div>}
      {options.map((option: OptionItem, index: number) => (
        <OptionSetOption
          key={index}
          index={index}
          onChange={replace}
          onRemove={remove}
          name={name}
        />
      ))}
      <Button onClick={push} buttonStyle={EnumButtonStyle.Text}>
        <Icon icon="plus" />
        Add option
      </Button>
    </div>
  );
};

/**
 * Replaces ArrayField's push behavior to indicate when to display an item
 * before pushing to the array so the new item won't trigger validation and won't be submitted
 * @param value the array value from the form
 */
function useVirtualPush(value: unknown[]): [() => void, boolean] {
  const [indexOfNew, setIndexOfNew] = useState<number | null>(0);

  const add = useCallback(() => {
    setIndexOfNew(value.length);
  }, [setIndexOfNew, value]);

  useEffect(() => {
    if (indexOfNew !== null && value.length > indexOfNew) {
      setIndexOfNew(null);
    }
  }, [value, indexOfNew, setIndexOfNew]);

  const hasNew = indexOfNew !== null;

  return [add, hasNew];
}

type OptionSetOptionType = {
  name: string;
  index: number;
  onRemove: (index: number) => void;
  onChange: (index: number, option: OptionItem) => void;
};

const OptionSetOption = ({
  name,
  index,
  onRemove,
  onChange,
}: OptionSetOptionType) => {
  const handleRemoveOption = useCallback(() => {
    onRemove(index);
  }, [onRemove, index]);

  const handleLabelChange = useCallback(
    (event) => {
      const label = event.target.value;
      const newValue = pascalCase(event.target.value);
      const option = { label: label, value: newValue };
      onChange(index, option);
    },
    [index, onChange]
  );

  return (
    <div className="option-set__option">
      <TextField
        autoComplete="off"
        name={`${name}.${index}.label`}
        label="Label"
        onChange={handleLabelChange}
      />
      <TextField
        name={`${name}.${index}.value`}
        label="Value"
        autoComplete="off"
      />

      <div className="option-set__option__action">
        <Button
          type="button"
          buttonStyle={EnumButtonStyle.Text}
          icon="trash_2"
          onClick={handleRemoveOption}
        />
      </div>
    </div>
  );
};
