import classNames from "classnames";
import { Icon } from "../Icon/Icon";
import { Popover, Props as PopoverProps } from "../Popover/Popover";
import "./InputTooltip.scss";

export type Props = Omit<PopoverProps, "children">;

const CLASS_NAME = "input-tooltip";

export function InputTooltip({
  className,
  placement = "right",
  ...rest
}: Props) {
  return (
    <span className={CLASS_NAME}>
      <Popover
        className={classNames(`${CLASS_NAME}__popover`, className)}
        placement={placement}
        {...rest}
      >
        <div className={CLASS_NAME}>
          <Icon
            icon="help_circle"
            size="xsmall"
            className={`${CLASS_NAME}__icon`}
          />
        </div>
      </Popover>
    </span>
  );
}
