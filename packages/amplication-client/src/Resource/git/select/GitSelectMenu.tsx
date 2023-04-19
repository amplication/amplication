import {
  EnumButtonStyle,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
} from "@amplication/ui/design-system";
import { GitSelectMenuItemContent } from "./GitSelectMenuItemContent";

import "./GitSelectMenu.scss";

const CLASS_NAME = "git-select-menu";

export type Props = {
  selectedItem: any;
  items: any[];
  onSelect: (item: any) => void;
};

export const GitSelectMenu = ({ selectedItem, items, onSelect }: Props) => {
  return (
    <SelectMenu
      title={
        selectedItem && (
          <GitSelectMenuItemContent
            logo={selectedItem.logo}
            name={selectedItem.name}
          />
        )
      }
      buttonStyle={EnumButtonStyle.Text}
      className={CLASS_NAME}
      icon="chevron_down"
    >
      <SelectMenuModal>
        <div className={`${CLASS_NAME}__select-menu`}>
          <SelectMenuList>
            <>
              {items?.map((item) => (
                <SelectMenuItem
                  closeAfterSelectionChange
                  selected={selectedItem?.id === item.id}
                  key={item.id}
                  onSelectionChange={() => {
                    onSelect(item);
                  }}
                >
                  <GitSelectMenuItemContent logo={item.logo} name={item.name} />
                </SelectMenuItem>
              ))}
            </>
          </SelectMenuList>
        </div>
      </SelectMenuModal>
    </SelectMenu>
  );
};
