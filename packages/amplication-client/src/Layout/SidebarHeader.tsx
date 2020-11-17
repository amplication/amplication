import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { DrawerHeader } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { GlobalHotKeys } from "react-hotkeys";
import { Tooltip } from "@primer/components";

import { Icon } from "@rmwc/icon";
import "./Sidebar.scss";
import { Button, EnumButtonStyle } from "../Components/Button";

type Props = {
  /**The content of the header, to be placed within a <h3> element */
  children: React.ReactNode;
  /**Whether to show a back button in the header of the sidebar */
  showBack?: boolean;
  /**The URL to navigate to when the user clicks on the back button. When empty history.goBack is used  */
  backUrl?: string;
};

const DIRECTION = "s";
const keyMap = {
  SUBMIT: ["CLOSE_SIDEBAR", "esc"],
};
const SidebarHeader = ({ children, showBack, backUrl }: Props) => {
  const history = useHistory();

  const goBack = useCallback(() => {
    if (backUrl) {
      history.push(backUrl);
    } else {
      history.goBack();
    }
  }, [history, backUrl]);

  const handlers = {
    SUBMIT: goBack,
  };

  return (
    <DrawerHeader className="side-bar__header">
      <GlobalHotKeys keyMap={keyMap} handlers={handlers} />

      {showBack && (
        <Tooltip aria-label="Close (Esc)" direction={DIRECTION}>
          <Button
            buttonStyle={EnumButtonStyle.Clear}
            className="side-bar__header__back"
            onClick={goBack}
          >
            <Icon icon="close" />
          </Button>
        </Tooltip>
      )}
      <h3>{children}</h3>
    </DrawerHeader>
  );
};

export default SidebarHeader;
