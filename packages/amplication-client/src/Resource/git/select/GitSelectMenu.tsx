import {
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { GitSelectMenuItemContent } from "./GitSelectMenuItemContent";

import { EnumGitProvider } from "../../../models";
import { gitLogoMap } from "../git-provider-icon-map";

export type Props = {
  selectedItem: any;
  items: any[];
  onSelect: (item: any) => void;
  gitProvider: EnumGitProvider;
};

export const GitSelectGroup = ({
  selectedItem,
  items,
  onSelect,
  gitProvider,
}: Props) => {
  return (
    <>
      {items && items.length === 0 ? (
        <FlexItem margin={EnumFlexItemMargin.Bottom}>
          <Text
            textStyle={EnumTextStyle.Description}
            textColor={EnumTextColor.ThemeOrange}
          >
            No groups found in the organization. You need to create at least one
            group in the organization.
          </Text>
        </FlexItem>
      ) : (
        <>
          <Text textStyle={EnumTextStyle.Description}>Select Group</Text>
          <SelectMenu
            title={
              selectedItem && (
                <GitSelectMenuItemContent
                  logo={gitLogoMap[gitProvider]}
                  name={selectedItem.name}
                />
              )
            }
            buttonStyle={EnumButtonStyle.Outline}
            icon="chevron_down"
          >
            <SelectMenuModal>
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
        </>
      )}
    </>
  );
};
