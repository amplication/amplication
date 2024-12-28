import {
  Button,
  EnumButtonStyle,
  EnumFlexItemMargin,
  EnumItemsAlign,
  EnumTextColor,
  EnumTextStyle,
  FlexItem,
  Icon,
  List,
  ListItem,
  SearchField,
  Text,
} from "@amplication/ui/design-system";
import { useEffect, useMemo, useState } from "react";
import { UserInfo } from "../../Components/UserInfo";
import * as models from "../../models";
import useTeams from "../hooks/useTeams";

type Props = {
  team: models.Team;
  onAddMembers: (userIds: string[]) => void;
};

const CLASS_NAME = "add-team-member";

const AddTeamMember = ({ team, onAddMembers }: Props) => {
  const { getAvailableWorkspaceMembers, availableWorkspaceMembers } = useTeams(
    team?.id
  );

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleSelectMember = (userId: string) => {
    const checked = !selectedMembers.includes(userId);

    if (checked) {
      setSelectedMembers([...selectedMembers, userId]);
    } else {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    }
  };

  const handleAddMembers = () => {
    onAddMembers(selectedMembers);
  };

  useEffect(() => {
    getAvailableWorkspaceMembers();
  }, []);

  const availableWorkspaceMembersFiltered = useMemo(() => {
    if (!searchPhrase) {
      return availableWorkspaceMembers;
    }

    const lowerSearchPhrase = searchPhrase.toLowerCase();

    return availableWorkspaceMembers.filter(
      (member) =>
        member.account?.email?.toLowerCase().includes(lowerSearchPhrase) ||
        member.account?.firstName?.toLowerCase().includes(lowerSearchPhrase) ||
        member.account?.lastName?.toLowerCase().includes(lowerSearchPhrase)
    );
  }, [availableWorkspaceMembers, searchPhrase]);

  return (
    <>
      <FlexItem
        margin={EnumFlexItemMargin.Bottom}
        itemsAlign={EnumItemsAlign.Center}
        start={
          <SearchField
            label="search"
            placeholder="search"
            onChange={setSearchPhrase}
          />
        }
      ></FlexItem>
      <List className={CLASS_NAME}>
        {availableWorkspaceMembersFiltered.map((member, index) => (
          <ListItem
            onClick={() => {
              handleSelectMember(member.id);
            }}
            key={index}
            start={
              <Icon
                icon={
                  selectedMembers.includes(member.id)
                    ? "check_square"
                    : "square"
                }
                color={
                  selectedMembers.includes(member.id)
                    ? EnumTextColor.ThemeGreen
                    : EnumTextColor.Black20
                }
              />
            }
          >
            <UserInfo user={member} />
          </ListItem>
        ))}
      </List>
      <FlexItem
        margin={EnumFlexItemMargin.Top}
        itemsAlign={EnumItemsAlign.Center}
        start={
          <Text textStyle={EnumTextStyle.Description}>
            {selectedMembers.length ? `${selectedMembers.length} selected` : ""}
          </Text>
        }
        end={
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            disabled={!selectedMembers.length}
            onClick={handleAddMembers}
          >
            Add Members
          </Button>
        }
      ></FlexItem>
    </>
  );
};

export default AddTeamMember;
