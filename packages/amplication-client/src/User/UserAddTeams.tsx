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
import { useMemo, useState } from "react";
import useTeams from "../Teams/hooks/useTeams";
import * as models from "../models";

type Props = {
  user: models.User;
  onAddTeams: (teamIds: string[]) => void;
};

const CLASS_NAME = "add-team-member";

const UserAddTeams = ({ user, onAddTeams }: Props) => {
  const { findTeamsData } = useTeams();

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const handleSelectTeam = (teamId: string) => {
    const checked = !selectedTeams.includes(teamId);

    if (checked) {
      setSelectedTeams([...selectedTeams, teamId]);
    } else {
      setSelectedTeams(selectedTeams.filter((id) => id !== teamId));
    }
  };

  const handleAddTeams = () => {
    onAddTeams(selectedTeams);
  };

  const availableTeamsFiltered = useMemo(() => {
    const availableTeams =
      findTeamsData?.teams.filter(
        (team) => !user.teams?.find((userTeam) => userTeam.id === team.id)
      ) || [];

    if (!searchPhrase) {
      return availableTeams;
    }

    const lowerSearchPhrase = searchPhrase.toLowerCase();

    return availableTeams.filter((team) =>
      team.name.toLowerCase().includes(lowerSearchPhrase)
    );
  }, [findTeamsData?.teams, searchPhrase, user]);

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
        {availableTeamsFiltered.map((team) => (
          <ListItem
            onClick={() => {
              handleSelectTeam(team.id);
            }}
            key={team.id}
            start={
              <Icon
                icon={
                  selectedTeams.includes(team.id) ? "check_square" : "square"
                }
                color={
                  selectedTeams.includes(team.id)
                    ? EnumTextColor.ThemeGreen
                    : EnumTextColor.Black20
                }
              />
            }
          >
            {team.name}
          </ListItem>
        ))}
      </List>
      <FlexItem
        margin={EnumFlexItemMargin.Top}
        itemsAlign={EnumItemsAlign.Center}
        start={
          <Text textStyle={EnumTextStyle.Description}>
            {selectedTeams.length ? `${selectedTeams.length} selected` : ""}
          </Text>
        }
        end={
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            disabled={!selectedTeams.length}
            onClick={handleAddTeams}
          >
            Add to Teams
          </Button>
        }
      ></FlexItem>
    </>
  );
};

export default UserAddTeams;
