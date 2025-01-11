import {
  CircularProgress,
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
import { GitSelectGroupItem } from "./GitSelectGroupItem";

import { EnumGitProvider } from "../../../models";

export type Props = {
  selectedItem: any;
  items: any[];
  onSelect: (item: any) => void;
  gitProvider: EnumGitProvider;
  loadingGroups: boolean;
};

export const GitSelectGroup = ({
  selectedItem,
  items,
  onSelect,
  gitProvider,
  loadingGroups,
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
          {loadingGroups ? (
            <CircularProgress />
          ) : (
            <SelectMenu
              title={
                selectedItem && (
                  <GitSelectGroupItem
                    gitProvider={gitProvider}
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
                        <GitSelectGroupItem
                          gitProvider={gitProvider}
                          name={item.name}
                        />
                      </SelectMenuItem>
                    ))}
                  </>
                </SelectMenuList>
              </SelectMenuModal>
            </SelectMenu>
          )}
        </>
      )}
    </>
  );
};
