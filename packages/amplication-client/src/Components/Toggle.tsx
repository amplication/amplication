import React, { useCallback } from "react";
import { Switch, SwitchProps, SwitchHTMLProps } from "@rmwc/switch";
import "@rmwc/switch/styles";
import { isEmpty } from "lodash";
import classNames from "classnames";
import "./Toggle.scss";

const CLASS_NAME = "toggle-field";

export type Props = SwitchProps &
  SwitchHTMLProps & {
    name?: string;
    label?: string;
    onValueChange?: (selected: boolean) => void;
  };

export const Toggle = (props: Props) => {
  const { label, onValueChange, ...rest } = props;

  const handleChange = useCallback(
    (evt) => {
      if (onValueChange) {
        onValueChange(evt.currentTarget.checked);
      }
    },
    [onValueChange]
  );

  const switchNode = onValueChange ? (
    <Switch {...rest} onChange={handleChange} />
  ) : (
    <Switch {...rest} />
  );

  const componentNode = !isEmpty(label) ? (
    <div className={classNames(CLASS_NAME, `${CLASS_NAME}--with-label`)}>
      <label>
        {label} {switchNode}
      </label>
    </div>
  ) : (
    <div className={CLASS_NAME}>{switchNode}</div>
  );

  return componentNode;
};
