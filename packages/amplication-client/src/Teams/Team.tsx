import {
  FlexItem,
  Snackbar,
  TabContentTitle,
} from "@amplication/ui/design-system";
import { useCallback } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import { formatError } from "../util/error";
import useTeam from "./hooks/useTeams";
import TeamForm from "./TeamForm";
import { DeleteTeam } from "./DeleteTeam";
import { useAppContext } from "../context/appContext";

const Team = () => {
  const match = useRouteMatch<{
    teamId: string;
  }>(["/:workspace/teams/:teamId"]);

  const { currentWorkspace } = useAppContext();
  const baseUrl = `/${currentWorkspace?.id}`;
  const history = useHistory();

  const { teamId } = match?.params ?? {};

  const {
    getTeamData: data,
    getTeamError: error,
    getTeamLoading: loading,
    updateTeam,
    updateTeamError: updateError,
  } = useTeam(teamId);

  const handleSubmit = useCallback(
    (data) => {
      updateTeam({
        variables: {
          where: {
            id: teamId,
          },
          data,
        },
      }).catch(console.error);
    },
    [updateTeam, teamId]
  );

  const handleDeleteModule = useCallback(() => {
    history.push(`${baseUrl}/teams`);
  }, [history, baseUrl]);

  const hasError = Boolean(error) || Boolean(updateError);
  const errorMessage = formatError(error) || formatError(updateError);

  return (
    <>
      <FlexItem>
        <TabContentTitle
          title={data?.team?.name}
          subTitle={data?.team?.description}
        />
        <FlexItem.FlexEnd>
          {data?.team && (
            <DeleteTeam team={data?.team} onDelete={handleDeleteModule} />
          )}
        </FlexItem.FlexEnd>
      </FlexItem>
      {!loading && (
        <TeamForm onSubmit={handleSubmit} defaultValues={data?.team} />
      )}
      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default Team;
