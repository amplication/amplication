import {
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import React, { useCallback, useContext } from "react";
import { useHistory } from "react-router-dom";
import { EnumButtonStyle } from "../../Components/Button";
import { AppContext } from "../../context/appContext";
import {
  AMPLICATION_DISCORD_URL,
  AMPLICATION_DOC_URL,
} from "../../util/constants";
import { version } from "../../util/version";
import { useContactUs } from "../hooks/useContactUs";
import "./HelpMenu.scss";

const CLASS_NAME = "header-help_menu";

enum ItemDataCommand {
  COMMAND_CONTACT_US = "command_contact_us",
}

type HelpMenuItem = {
  name: string;
  url: string | null;
  itemData: ItemDataCommand | null;
};

const HELP_MENU_LIST: HelpMenuItem[] = [
  { name: "Docs", url: AMPLICATION_DOC_URL, itemData: null },
  {
    name: "Technical Support",
    url: AMPLICATION_DISCORD_URL,
    itemData: null,
  },
  {
    name: "Contact Us",
    url: null,
    itemData: ItemDataCommand.COMMAND_CONTACT_US,
  },
];

const HelpMenu: React.FC = () => {
  const { currentWorkspace } = useContext(AppContext);

  const { handleContactUsClick } = useContactUs({
    actionName: "Contact Us",
    eventOriginLocation: "workspace-header-help-menu",
  });

  const history = useHistory();

  const handleItemDataClicked = useCallback(
    (itemData: ItemDataCommand) => {
      if (itemData === ItemDataCommand.COMMAND_CONTACT_US) {
        handleContactUsClick();
      }
      return;
    },
    [handleContactUsClick]
  );

  return (
    <div className={`${CLASS_NAME}`}>
      <SelectMenu
        title="Help"
        buttonStyle={EnumButtonStyle.Text}
        icon="chevron_down"
        openIcon="chevron_up"
      >
        <SelectMenuModal align="right">
          <SelectMenuList>
            {HELP_MENU_LIST.map((route: HelpMenuItem, index) => (
              <SelectMenuItem
                closeAfterSelectionChange
                onSelectionChange={() => {
                  !route.url && handleItemDataClicked(route.itemData);
                }}
                key={index}
                {...(route.url
                  ? {
                      rel: "noopener noreferrer",
                      href: route.url,
                      target: "_blank",
                    }
                  : {})}
              >
                <div className={`${CLASS_NAME}__name`}>{route.name}</div>
              </SelectMenuItem>
            ))}
            <SelectMenuItem
              closeAfterSelectionChange
              onSelectionChange={() => {
                history.push(`/${currentWorkspace?.id}/purchase`);
              }}
            >
              <div className={`${CLASS_NAME}__name`}>Pricing Plans</div>
            </SelectMenuItem>
            <SelectMenuItem closeAfterSelectionChange>
              <div className={`${CLASS_NAME}__name`}>
                <a
                  href="https://github.com/amplication/amplication/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Release Notes (v{version})
                </a>
              </div>
            </SelectMenuItem>
          </SelectMenuList>
        </SelectMenuModal>
      </SelectMenu>
    </div>
  );
};

export default HelpMenu;
