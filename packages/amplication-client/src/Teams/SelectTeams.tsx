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
import useTeams from "./hooks/useTeams";

type Props = {
  filteredTeamIds: string[];
  onSelectTeams: (teamIds: string[]) => void;
};

const SelectTeams = ({ filteredTeamIds, onSelectTeams }: Props) => {
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [selectedTeams, setSelectedTeams] = useState<{ string: boolean }>(
    {} as { string: boolean }
  );

  const { findTeamsData } = useTeams();

  const handleSelectTeam = (teamId: string) => {
    const checked = !selectedTeams[teamId];

    if (checked) {
      setSelectedTeams({ ...selectedTeams, [teamId]: true });
    } else {
      setSelectedTeams((prevState) => {
        const newState = { ...prevState };
        delete newState[teamId];
        return newState;
      });
    }
  };

  const handleAddPermissions = () => {
    onSelectTeams(Object.keys(selectedTeams));
  };

  const availableTeams = useMemo(() => {
    const unusedTeams =
      findTeamsData?.teams.filter(
        (team) => !filteredTeamIds.includes(team.id)
      ) || [];

    if (!searchPhrase) {
      return unusedTeams;
    }

    const lowerSearchPhrase = searchPhrase.toLowerCase();

    return unusedTeams.filter((team) =>
      team.name.toLowerCase().includes(lowerSearchPhrase)
    );
  }, [findTeamsData?.teams, searchPhrase, filteredTeamIds]);

  const selectedCount = Object.keys(selectedTeams).length;

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
      <List>
        {availableTeams.map((team) => (
          <ListItem
            onClick={() => {
              handleSelectTeam(team.id);
            }}
            key={team.id}
            start={
              <Icon
                icon={selectedTeams[team.id] ? "check_square" : "square"}
                color={
                  selectedTeams[team.id]
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
            {selectedCount ? `${selectedCount} selected` : ""}
          </Text>
        }
        end={
          <Button
            buttonStyle={EnumButtonStyle.Primary}
            disabled={!selectedCount}
            onClick={handleAddPermissions}
          >
            Add Teams
          </Button>
        }
      ></FlexItem>
    </>
  );
};

export default SelectTeams;
