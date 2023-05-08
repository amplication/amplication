import React from "react";
import { Panel, EnumPanelStyle, Icon } from "@amplication/ui/design-system";
import "./OverviewSecondaryTile.scss";

const CLASS_NAME = "overview-secondary-tile";

interface Props {
  title: string;
  icon: string;
  message: string;
  footer: React.ReactNode;
  headerExtra?: React.ReactNode;
  showComingSoon?: boolean;
  onClick?: (e) => void;
}
const OverviewSecondaryTile: React.FC<Props> = ({
  title,
  icon,
  message,
  footer,
  headerExtra,
  showComingSoon,
  onClick,
}) => {
  return (
    <Panel
      clickable={!!onClick}
      panelStyle={EnumPanelStyle.Bordered}
      className={CLASS_NAME}
      onClick={onClick}
    >
      <>
        <div className={`${CLASS_NAME}__header`}>
          <Icon icon={icon} size="small" />
          <h2 className={`${CLASS_NAME}__header__title`}>{title}</h2>

          {headerExtra && (
            <div className={`${CLASS_NAME}__header__extra`}>{headerExtra}</div>
          )}
        </div>
        <div className={`${CLASS_NAME}__message`}>{message}</div>
        <div className={`${CLASS_NAME}__footer`}>{footer}</div>
        {showComingSoon && (
          <div className={`${CLASS_NAME}__ribbon`}>Coming Soon</div>
        )}
      </>
    </Panel>
  );
};

export default OverviewSecondaryTile;
