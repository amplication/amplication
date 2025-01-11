import {
  CircularProgress,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  Icon,
  List,
  ListItem,
  SearchField,
  Snackbar,
  TabContentTitle,
  Text,
} from "@amplication/ui/design-system";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import { TeamInfo } from "../Components/TeamInfo";
import { useAppContext } from "../context/appContext";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import useTeams from "./hooks/useTeams";
import NewTeam from "./NewTeam";

const CLASS_NAME = "team-list";

export const TeamList = React.memo(() => {
  const { currentWorkspace, permissions } = useAppContext();

  const canCreate = permissions.canPerformTask("team.create");

  const baseUrl = `/${currentWorkspace?.id}/settings`;

  const {
    setSearchPhrase,
    findTeamsData: data,
    findTeamsError: error,
    findTeamsLoading: loading,
  } = useTeams();

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );
  const history = useHistory();

  const errorMessage = formatError(error);

  const handleTeamChange = useCallback(
    (team: models.Team) => {
      const fieldUrl = `${baseUrl}/teams/${team.id}`;
      history.push(fieldUrl);
    },
    [history, baseUrl]
  );

  return (
    <div className={CLASS_NAME}>
      <TabContentTitle title="Teams" />
      <FlexItem
        itemsAlign={EnumItemsAlign.End}
        end={
          <SearchField
            label="search"
            placeholder="search"
            onChange={handleSearchChange}
          />
        }
      >
        <Text textStyle={EnumTextStyle.Tag}>
          {data?.teams.length || "0"}{" "}
          {pluralize(data?.teams.length, "Team", "Teams")}
        </Text>
        {loading && <CircularProgress />}
      </FlexItem>

      <HorizontalRule />

      <List
        headerContent={
          canCreate && (
            <NewTeam disabled={!data?.teams} onTeamAdd={handleTeamChange} />
          )
        }
      >
        {data?.teams?.map((team) => (
          <ListItem
            to={`${baseUrl}/teams/${team.id}`}
            start={<Icon icon="teams" />}
          >
            <FlexItem
              singeChildWithEllipsis
              itemsAlign={EnumItemsAlign.Center}
              end={
                <Text textStyle={EnumTextStyle.Description}>
                  {team.members.length}{" "}
                  {pluralize(team.members.length, "Member", "Members")}
                </Text>
              }
            >
              <TeamInfo team={team} />
              {/* <span>{team.name}</span> */}
            </FlexItem>
          </ListItem>
        ))}
      </List>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
});
