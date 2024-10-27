import {
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Icon,
  SearchField,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { Resource, Team, User } from "../models";
import ResourceOwner from "../Workspaces/ResourceOwner";
import { EnumButtonStyle } from "./Button";
import { UserInfo } from "./UserInfo";
import { TeamInfo } from "./TeamInfo";

const CLASS_NAME = "alert-status-selector";

type Props = {
  resource: Resource;
  disabled?: boolean;
};

export const OwnerSelector = ({ resource, disabled }: Props) => {
  const { id, resourceType, owner } = resource;

  let content = null;

  if (!owner) {
    content = <Text textStyle={EnumTextStyle.Description}>(not set)</Text>;
  } else if (owner["__typename"] === "User") {
    content = <UserInfo user={owner as User} showEmail={false} />;
  } else if (owner["__typename"] === "Team") {
    content = <TeamInfo team={owner as Team} />;
  }

  return (
    <SelectMenu
      buttonAsTextBox
      buttonAsTextBoxLabel="Owner"
      disabled={disabled}
      className={CLASS_NAME}
      title={
        <FlexItem gap={EnumGapSize.Small} itemsAlign={EnumItemsAlign.Center}>
          {content}
        </FlexItem>
      }
      buttonStyle={EnumButtonStyle.Text}
    >
      <SelectMenuModal>
        <SelectMenuList>
          <SearchField
            placeholder="Search for owner"
            onChange={() => {}}
            label="search"
          />

          <Text textStyle={EnumTextStyle.Normal}>Users</Text>
          <SelectMenuItem closeAfterSelectionChange>
            <FlexItem
              gap={EnumGapSize.Small}
              itemsAlign={EnumItemsAlign.Center}
            >
              <Text
                textColor={EnumTextColor.White}
                textStyle={EnumTextStyle.Tag}
              >
                User Name 1
              </Text>
            </FlexItem>
          </SelectMenuItem>
          <SelectMenuItem closeAfterSelectionChange>
            <FlexItem
              gap={EnumGapSize.Small}
              itemsAlign={EnumItemsAlign.Center}
            >
              <Text
                textColor={EnumTextColor.White}
                textStyle={EnumTextStyle.Tag}
              >
                User Name 3
              </Text>
            </FlexItem>
          </SelectMenuItem>
          <Text textStyle={EnumTextStyle.Normal}>Teams</Text>
          <SelectMenuItem closeAfterSelectionChange>
            <FlexItem
              gap={EnumGapSize.Small}
              itemsAlign={EnumItemsAlign.Center}
            >
              <Text
                textColor={EnumTextColor.White}
                textStyle={EnumTextStyle.Tag}
              >
                Team Name 1
              </Text>
            </FlexItem>
          </SelectMenuItem>
          <SelectMenuItem closeAfterSelectionChange>
            <FlexItem
              gap={EnumGapSize.Small}
              itemsAlign={EnumItemsAlign.Center}
            >
              <Text
                textColor={EnumTextColor.White}
                textStyle={EnumTextStyle.Tag}
              >
                Team Name 2
              </Text>
            </FlexItem>
          </SelectMenuItem>
        </SelectMenuList>
      </SelectMenuModal>
    </SelectMenu>
  );
};
