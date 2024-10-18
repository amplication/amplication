import React from "react";
import { Icon } from "../Icon/Icon";
import { Button, EnumButtonStyle } from "../Button/Button";
import { CLASS_NAME } from "./DataGrid";
import classNames from "classnames";

type CellExpanderFormatterProps = {
  tabIndex: number;
  expanded: boolean;
  onCellExpand: () => void;
};

export function DataGridRowExpander({
  tabIndex,
  expanded,
  onCellExpand,
}: CellExpanderFormatterProps) {
  return (
    <Button
      buttonStyle={EnumButtonStyle.Text}
      onClick={onCellExpand}
      className={classNames(`${CLASS_NAME}__expand-button`, {
        [`${CLASS_NAME}__expand-button--expanded`]: expanded,
      })}
    >
      <Icon icon="chevron_right" size="small" />
    </Button>
  );
}
