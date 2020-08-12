import React from "react";
import { useHistory } from "react-router-dom";
import { DrawerHeader } from "@rmwc/drawer";
import "@rmwc/drawer/styles";
import { Icon } from "@rmwc/icon";
import "./Sidebar.scss";
import { Button, EnumButtonStyle } from "../Components/Button";

type Props = {
  /**The content of the header, to be placed within a <h3> element */
  children: React.ReactNode;
  /**Whether to show a back button in the header of the sidebar */
  showBack?: boolean;
  /**The URL to navigate to when the user clicks oon the back button. When empty history.goBack is used  */
  backUrl?: string;
};

const SidebarHeader = ({ children, showBack, backUrl }: Props) => {
  const history = useHistory();

  function goBack() {
    if (backUrl) {
      history.push(backUrl);
    } else {
      history.goBack();
    }
  }

  return (
    <DrawerHeader className="side-bar__header">
      <h3>{children}</h3>
      {showBack && (
        <Button
          buttonStyle={EnumButtonStyle.Clear}
          className="side-bar__header__back"
          onClick={goBack}
        >
          <Icon icon="east" />
        </Button>
      )}
    </DrawerHeader>
  );
};

export default SidebarHeader;
