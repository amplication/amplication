import classNames from "classnames";
import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../Button/Button";
import { EnumItemsAlign, FlexEnd, FlexItem } from "../FlexItem/FlexItem";
import { Icon } from "../Icon/Icon";
import { CollapsibleList } from "./CollapsibleList";
import "./CollapsibleListItem.scss";

export type Props = {
  children: React.ReactNode;
  icon?: string;
  className?: string;
  childItems?: React.ReactNode;
  expandable?: boolean;
  initiallyExpanded?: boolean;
  onExpand?: () => void;
};

const CLASS_NAME = "amp-collapsible-list-item";

export function CollapsibleListItem({
  children,
  icon,
  className,
  childItems,
  expandable,
  initiallyExpanded = false,
  onExpand,
}: Props) {
  const [expanded, setExpanded] = React.useState(initiallyExpanded);

  const handleExpand = useCallback(
    (e: any) => {
      e.preventDefault();
      setExpanded((expanded) => !expanded);
      onExpand && onExpand();
    },
    [onExpand, setExpanded]
  );

  return (
    <>
      <Button
        className={classNames(CLASS_NAME, className, {
          [`${CLASS_NAME}--expanded`]: expanded,
        })}
        onClick={handleExpand}
        buttonStyle={EnumButtonStyle.Text}
      >
        <FlexItem
          itemsAlign={EnumItemsAlign.Center}
          start={icon && <Icon icon={icon} size="small" />}
        >
          <span className={`${CLASS_NAME}__inner-span`}>{children}</span>

          <FlexEnd className={`${CLASS_NAME}__expand-button-container`}>
            {expandable && (
              <Button
                className={classNames(`${CLASS_NAME}__expand-button`, {
                  [`${CLASS_NAME}__expand-button--expanded`]: expanded,
                })}
                buttonStyle={EnumButtonStyle.Text}
                iconSize="small"
                icon={"chevron_right"}
              />
            )}
          </FlexEnd>
        </FlexItem>
      </Button>

      {childItems && expanded && (
        <CollapsibleList
          className={classNames(`${CLASS_NAME}__child-items`, {
            [`${CLASS_NAME}__child-items--expanded`]: expanded,
          })}
        >
          {childItems}
        </CollapsibleList>
      )}
    </>
  );
}
