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
import useTeam from "./hooks/useTeams";
import NewTeam from "./NewTeam";

const CLASS_NAME = "team-list";

type Props = {
  selectFirst?: boolean;
};

export const TeamList = React.memo(({ selectFirst = false }: Props) => {
  const { currentWorkspace } = useAppContext();

  const baseUrl = `/${currentWorkspace?.id}`;

  const {
    setSearchPhrase,
    findTeamsData: data,
    findTeamsError: error,
    findTeamsLoading: loading,
  } = useTeam();

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

  useEffect(() => {
    if (selectFirst && data && !isEmpty(data.teams)) {
      const team = data.teams[0];
      const fieldUrl = `${baseUrl}/teams/${team.id}`;
      history.push(fieldUrl);
    }
  }, [data, selectFirst, history, baseUrl]);

  return (
    <div className={CLASS_NAME}>
      <FlexItem margin={EnumFlexItemMargin.Bottom}>
        <Text textStyle={EnumTextStyle.Tag}>
          {data?.teams.length} {pluralize(data?.teams.length, "Team", "Teams")}
        </Text>
      </FlexItem>
      {data?.teams && <NewTeam onTeamAdd={handleTeamChange} />}
      <HorizontalRule />
      <SearchField
        label="search"
        placeholder="search"
        onChange={handleSearchChange}
      />

      {loading && <CircularProgress centerToParent />}
      <FlexItem
        margin={EnumFlexItemMargin.Top}
        direction={EnumFlexDirection.Column}
        itemsAlign={EnumItemsAlign.Stretch}
        gap={EnumGapSize.None}
      >
        {data?.teams?.map((team) => (
          <InnerTabLink icon="teams" to={`${baseUrl}/teams/${team.id}`}>
            <span>{team.name}</span>
          </InnerTabLink>
        ))}
      </FlexItem>
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </div>
  );
});
