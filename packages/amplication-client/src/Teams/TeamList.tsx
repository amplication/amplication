import {
  CircularProgress,
  EnumFlexDirection,
  EnumFlexItemMargin,
  EnumGapSize,
  EnumItemsAlign,
  EnumTextStyle,
  FlexItem,
  HorizontalRule,
  SearchField,
  Snackbar,
  Text,
} from "@amplication/ui/design-system";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import InnerTabLink from "../Layout/InnerTabLink";
import * as models from "../models";
import { formatError } from "../util/error";
import { pluralize } from "../util/pluralize";
import useTeams from "./hooks/useTeams";
import NewTeam from "./NewTeam";
import { TeamInfo } from "../Components/TeamInfo";

const CLASS_NAME = "team-list";

export const TeamList = React.memo(() => {
  const { currentWorkspace } = useAppContext();

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
      <FlexItem
        margin={EnumFlexItemMargin.Bottom}
        end={loading && <CircularProgress centerToParent />}
      >
        <Text textStyle={EnumTextStyle.Tag}>
          {data?.teams.length || "0"}{" "}
          {pluralize(data?.teams.length, "Team", "Teams")}
        </Text>
      </FlexItem>
      {<NewTeam disabled={!data?.teams} onTeamAdd={handleTeamChange} />}
      <HorizontalRule />
      <SearchField
        label="search"
        placeholder="search"
        onChange={handleSearchChange}
      />

      <FlexItem
        margin={EnumFlexItemMargin.Top}
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Stretch}
        gap={EnumGapSize.None}
      >
        {data?.teams?.map((team) => (
          <InnerTabLink icon="teams" to={`${baseUrl}/teams/${team.id}`}>
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
          </InnerTabLink>
        ))}
      </FlexItem>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
});
