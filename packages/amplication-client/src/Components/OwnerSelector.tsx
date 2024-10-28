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
import { EnumButtonStyle } from "./Button";
import { UserInfo } from "./UserInfo";
import { TeamInfo } from "./TeamInfo";
import useTeams from "../Teams/hooks/useTeams";
import { useCallback, useEffect } from "react";
import useResource from "../Resource/hooks/useResource";

const CLASS_NAME = "alert-status-selector";

type Props = {
  resource: Resource;
  disabled?: boolean;
};

export const OwnerSelector = ({ resource, disabled }: Props) => {
  const { id, owner } = resource;

  const { findTeamsData, getAvailableWorkspaceUsers, availableWorkspaceUsers } =
    useTeams();

  const { setResourceOwner } = useResource(id);

  let content = null;

  useEffect(() => {
    getAvailableWorkspaceUsers();
  }, []);

  const handleOwnerChanged = useCallback(
    (data) => {
      const isUserOwner = data.__typename === "User";

      setResourceOwner({
        variables: {
          data: {
            resourceId: id,
            userId: isUserOwner ? data.id : null,
            teamId: !isUserOwner ? data.id : null,
          },
        },
      }).catch(console.error);
    },
    [setResourceOwner, id]
  );

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
          {availableWorkspaceUsers?.map((user) => (
            <SelectMenuItem
              itemData={user}
              closeAfterSelectionChange
              onSelectionChange={handleOwnerChanged}
            >
              <FlexItem
                gap={EnumGapSize.Small}
                itemsAlign={EnumItemsAlign.Center}
              >
                <Text
                  textColor={EnumTextColor.White}
                  textStyle={EnumTextStyle.Tag}
                >
                  {user.account.email}
                </Text>
              </FlexItem>
            </SelectMenuItem>
          ))}
          <Text textStyle={EnumTextStyle.Normal}>Teams</Text>
          {findTeamsData?.teams?.map((team) => (
            <SelectMenuItem
              closeAfterSelectionChange
              itemData={team}
              onSelectionChange={handleOwnerChanged}
            >
              <FlexItem
                gap={EnumGapSize.Small}
                itemsAlign={EnumItemsAlign.Center}
              >
                <Text
                  textColor={EnumTextColor.White}
                  textStyle={EnumTextStyle.Tag}
                >
                  {team.name}
                </Text>
              </FlexItem>
            </SelectMenuItem>
          ))}
        </SelectMenuList>
      </SelectMenuModal>
    </SelectMenu>
  );
};
