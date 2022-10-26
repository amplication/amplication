import React, { useCallback } from "react";
import { Switch, SwitchProps } from "@mui/material";
import { isEmpty } from "lodash";
import classNames from "classnames";
import { LABEL_CLASS, LABEL_VALUE_CLASS } from "../constants";
import "./Toggle.scss";

const CLASS_NAME = "toggle-field";

export type Props = SwitchProps & {
  name?: string;
  label?: string;
  onValueChange?: (checked: boolean) => void;
};

export const Toggle = (props: Props) => {
  const { label, onChange, onValueChange, ...rest } = props;

  const handleChange = useCallback(
    (event) => {
      if (onChange) {
        onChange(event, event.currentTarget.checked);
      }
      if (onValueChange) {
        onValueChange(event.currentTarget.checked);
      }
    },
    [onChange, onValueChange]
  );

  const switchNode = <Switch {...rest} onChange={handleChange} />;

  const componentNode = !isEmpty(label) ? (
    <div className={classNames(CLASS_NAME, `${CLASS_NAME}--with-label`)}>
      <label className={LABEL_CLASS}>
        <span className={LABEL_VALUE_CLASS}>{label}</span>
        {switchNode}
      </label>
    </div>
  ) : (
    <div className={CLASS_NAME}>{switchNode}</div>
  );

  return componentNode;
};
