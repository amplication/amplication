import {
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  Icon,
  IconProps,
  Text,
} from "@amplication/ui/design-system";
import classNames from "classnames";
import { ReactNode } from "react";
import { Link, LinkProps } from "react-router-dom";
import "./BackNavigation.scss";

type Props = LinkProps & {
  label?: string | ReactNode;
  iconSize?: IconProps["size"];
};

const CLASS_NAME = "back-navigation";

export const BackNavigation = ({
  to,
  label,
  className,
  iconSize,
  ...rest
}: Props) => {
  return (
    <Link className={classNames(CLASS_NAME, className)} to={to} {...rest}>
      <Text textStyle={EnumTextStyle.Tag}>
        <FlexItem itemsAlign={EnumItemsAlign.Center} gap={EnumGapSize.None}>
          <Icon icon="arrow_left" size={iconSize} /> {label}
        </FlexItem>
      </Text>
    </Link>
  );
};
