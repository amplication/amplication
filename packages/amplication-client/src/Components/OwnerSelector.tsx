import {
  CollapsibleListItem,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  SelectMenu,
  SelectMenuItem,
  SelectMenuList,
  SelectMenuModal,
  Text,
} from "@amplication/ui/design-system";
import { useCallback, useEffect } from "react";
import { Resource, Team, User } from "../models";
import useResource from "../Resource/hooks/useResource";
import useTeams from "../Teams/hooks/useTeams";
import { EnumButtonStyle } from "./Button";
import "./OwnerSelector.scss";
import { TeamInfo } from "./TeamInfo";
import { UserInfo } from "./UserInfo";

const CLASS_NAME = "owner-selector";

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
    (data, typeName: string) => {
      const isUserOwner = typeName === "User";

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
          <CollapsibleListItem
            initiallyExpanded
            expandable
            icon={"users"}
            childItems={findTeamsData?.teams?.map((team) => (
              <SelectMenuItem
                closeAfterSelectionChange
                itemData={team}
                onSelectionChange={(data) => handleOwnerChanged(data, "User")}
              >
                <FlexItem
                  gap={EnumGapSize.Small}
                  itemsAlign={EnumItemsAlign.Center}
                  start={<Icon icon="users" color={EnumTextColor.Black20} />}
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
          >
            Teams
          </CollapsibleListItem>
          <CollapsibleListItem
            initiallyExpanded
            expandable
            icon={"user"}
            childItems={availableWorkspaceUsers?.map((user) => (
              <SelectMenuItem
                itemData={user}
                closeAfterSelectionChange
                onSelectionChange={(data) => handleOwnerChanged(data, "Team")}
              >
                <FlexItem
                  gap={EnumGapSize.Small}
                  itemsAlign={EnumItemsAlign.Center}
                  start={<Icon icon="user" color={EnumTextColor.Black20} />}
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
          >
            Users
          </CollapsibleListItem>
        </SelectMenuList>
      </SelectMenuModal>
    </SelectMenu>
  );
};
