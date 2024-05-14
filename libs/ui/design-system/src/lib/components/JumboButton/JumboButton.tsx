import { Link } from "react-router-dom";
import {
  EnumTextAlign,
  EnumTextColor,
  EnumTextStyle,
  Text,
} from "../Text/Text";
import "./JumboButton.scss";
import { CircleBadge } from "../CircleBadge/CircleBadge";
import { Icon } from "../Icon/Icon";
import classNames from "classnames";
import { useCallback } from "react";

export type Props = {
  icon: string;
  text: string;
  circleColor?: EnumTextColor;
  iconColor?: EnumTextColor;
  to?: string;
  onClick?: () => void;
  className?: string;
};
const CLASS_NAME = "amp-jumbo-button";

export const JumboButton = ({
  className,
  text,
  icon,
  circleColor = EnumTextColor.ThemeTurquoise,
  iconColor = EnumTextColor.Black,

  to,
  onClick,
}: Props) => {
  const bgColorVar = `var(--${circleColor})`;

  const handleClick = useCallback(
    (e) => {
      if (onClick) {
        onClick();
      }
      if (!to) {
        e.preventDefault();
        return;
      }
    },
    [onClick, to]
  );

  return (
    <Link
      to={to}
      className={classNames(CLASS_NAME, className)}
      onClick={handleClick}
    >
      <CircleBadge color={bgColorVar} size="medium">
        <Icon icon={icon} size="small" color={iconColor} />
      </CircleBadge>
      <Text textStyle={EnumTextStyle.H3} textAlign={EnumTextAlign.Center}>
        {text}
      </Text>
    </Link>
  );
};
export default JumboButton;
