import {
  Button,
  EnumButtonStyle,
  EnumItemsAlign,
  FlexItem,
  HorizontalRule,
  List,
  ListItem,
  Snackbar,
  TabContentTitle,
} from "@amplication/ui/design-system";
import { useRouteMatch } from "react-router-dom";

import { CircularProgress } from "@mui/material";
import { TeamInfo } from "../Components/TeamInfo";
import { UserInfo } from "../Components/UserInfo";
import { useAppContext } from "../context/appContext";
import { formatError } from "../util/error";
import useUsers from "./hooks/useUser";
import UserAddTeamsButton from "./UserAddTeamsButton";
import useTeams from "../Teams/hooks/useTeams";
import { useCallback } from "react";

const User = () => {
  const match = useRouteMatch<{
    userId: string;
  }>(["/:workspace/settings/members/:userId"]);

  const { currentWorkspace } = useAppContext();
  const baseUrl = `/${currentWorkspace?.id}/settings`;

  const { userId } = match?.params ?? {};

  const {
    getUserData: data,
    getUserError: error,
    getUserLoading: loading,
  } = useUsers(userId);

  const {
    addMemberToTeams,
    addMemberToTeamsError,
    removeMembersFromTeam,
    removeMembersFromTeamError,
  } = useTeams();

  const hasError =
    Boolean(error) ||
    Boolean(addMemberToTeamsError) ||
    Boolean(removeMembersFromTeamError);
  const errorMessage =
    formatError(error) ||
    formatError(addMemberToTeamsError) ||
    formatError(removeMembersFromTeamError);

  const handleAddTeams = useCallback(
    (teamIds: string[]) => {
      addMemberToTeams(userId, teamIds);
    },
    [addMemberToTeams, userId]
  );

  const handleRemoveMember = (teamId: string) => {
    removeMembersFromTeam(teamId, [userId]);
  };

  return (
    <>
      <TabContentTitle title="User Details" />
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <UserInfo user={data} />
          <HorizontalRule />
          <FlexItem
            itemsAlign={EnumItemsAlign.Center}
            end={<UserAddTeamsButton user={data} onAddTeams={handleAddTeams} />}
          >
            <TabContentTitle
              title="Teams"
              subTitle="This user is a member of the following teams"
            />
          </FlexItem>

          <List>
            {data?.teams.map((team) => (
              <ListItem
                key={team.id}
                to={`${baseUrl}/teams/${team.id}`}
                end={
                  <Button
                    icon="trash_2"
                    buttonStyle={EnumButtonStyle.Text}
                    onClick={(e) => {
                      handleRemoveMember(team.id);
                      e.stopPropagation();
                      e.preventDefault();
                    }}
                  />
                }
              >
                <TeamInfo team={team} />
              </ListItem>
            ))}
          </List>
        </>
      )}

      <Snackbar open={hasError} message={errorMessage} />
    </>
  );
};

export default User;
