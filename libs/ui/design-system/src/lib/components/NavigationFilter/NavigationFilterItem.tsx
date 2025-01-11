import React, { useCallback } from "react";
import { Tooltip, Props as TooltipProps } from "../Tooltip/Tooltip";

export type Props = {
  selected: boolean;
  tooltip?: string;
  tooltipDirection?: TooltipProps["direction"];
  children?: React.ReactNode;
  onClick: (selected: boolean) => void;
};

const CLASS_NAME = "amp-navigation-filter-item";

export const NavigationFilterItem = ({
  selected,
  tooltip,
  tooltipDirection = "ne",
  onClick,
  children,
}: Props) => {
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onClick(event.target.checked);
    },
    [onClick]
  );

  const title = (tooltip || "") + (selected ? ":On" : ":Off");

  return (
    <Tooltip aria-label={title} direction={tooltipDirection} noDelay>
      <div className={CLASS_NAME}>
        <label>
          <input
            type="checkbox"
            checked={selected}
            onChange={handleInputChange}
          />
          <span className={`${CLASS_NAME}__content`}>{children}</span>
        </label>
      </div>
    </Tooltip>
  );
};
