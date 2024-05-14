import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import { GitSelectMenuItemContent } from "./GitSelectMenuItemContent";

import "./GitSelectMenu.scss";
import { EnumGitProvider } from "../../../models";
import { gitLogoMap } from "../git-provider-icon-map";

const CLASS_NAME = "git-select-menu";

export type Props = {
  selectedItem: any;
  items: any[];
  onSelect: (item: any) => void;
  gitProvider: EnumGitProvider;
};

export const GitSelectMenu = ({
  selectedItem,
  items,
  onSelect,
  gitProvider,
}: Props) => {
  return (
    <SelectMenu
      title={
        selectedItem && (
          <GitSelectMenuItemContent
            logo={gitLogoMap[gitProvider]}
            name={selectedItem.name}
          />
        )
      }
      buttonStyle={EnumButtonStyle.Text}
      className={CLASS_NAME}
      icon="chevron_down"
    >
      <SelectMenuModal className={`${CLASS_NAME}__menu`}>
        <SelectMenuList className={`${CLASS_NAME}__list`}>
          <>
            {items?.map((item) => (
              <SelectMenuItem
                className={`${CLASS_NAME}__item`}
                closeAfterSelectionChange
                selected={selectedItem?.id === item.id}
                key={item.id}
                onSelectionChange={() => {
                  onSelect(item);
                }}
              >
                <GitSelectMenuItemContent
                  logo={gitLogoMap[gitProvider]}
                  name={item.name}
                />
              </SelectMenuItem>
            ))}
          </>
        </SelectMenuList>
      </SelectMenuModal>
    </SelectMenu>
  );
};
