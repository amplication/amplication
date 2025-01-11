import React, { useCallback, useEffect } from "react";
import { NavLink, useRouteMatch } from "react-router-dom";
import { EnumIconFamily, Icon } from "../Icon/Icon";
import classNames from "classnames";
import { VerticalNavigation } from "./VerticalNavigation";
import "./VerticalNavigationItem.scss";
import { EnumItemsAlign, FlexItem } from "../FlexItem/FlexItem";
import { Button, EnumButtonStyle } from "../Button/Button";

export type Props = {
  children: React.ReactNode;
  icon?: string;
  iconFamily?: EnumIconFamily;
  to: string;
  className?: string;
  childItems?: React.ReactNode;
  expandable?: boolean;
  onExpand?: () => void;
};

const CLASS_NAME = "amp-vertical-navigation-item";

export function VerticalNavigationItem({
  children,
  icon,
  to,
  className,
  childItems,
  expandable,
  iconFamily,
  onExpand,
}: Props) {
  const [expanded, setExpanded] = React.useState(false);

  const match = useRouteMatch({
    path: to,
  });

  const handleExpand = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setExpanded((expanded) => !expanded);
      onExpand && onExpand();
    },
    [onExpand, setExpanded]
  );

  useEffect(() => {
    if (match) {
      setExpanded(true);
    }
  }, [match?.path]);

  return (
    <>
      <NavLink
        to={to}
        exact
        onClick={() => setExpanded(true)}
        className={classNames(CLASS_NAME, className, {
          [`${CLASS_NAME}--expanded`]: expanded,
        })}
      >
        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          start={icon && <Icon icon={icon} size="small" family={iconFamily} />}
          end={
            expandable && (
              <Button
                className={classNames(`${CLASS_NAME}__expand-button`, {
                  [`${CLASS_NAME}__expand-button--expanded`]: expanded,
                })}
                buttonStyle={EnumButtonStyle.Text}
                onClick={handleExpand}
                iconSize="small"
                icon={"chevron_right"}
              />
            )
          }
        >
          <span className={`${CLASS_NAME}__inner-span`}>{children}</span>
        </FlexItem>
      </NavLink>

      {childItems && (
        <VerticalNavigation
          className={classNames(`${CLASS_NAME}__child-items`, {
            [`${CLASS_NAME}__child-items--expanded`]: expanded,
          })}
        >
          {childItems}
        </VerticalNavigation>
      )}
    </>
  );
}
