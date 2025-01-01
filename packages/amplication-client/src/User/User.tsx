import {
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

  const hasError = Boolean(error);
  const errorMessage = formatError(error);

  return (
    <>
      <TabContentTitle title="User Details" />
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <UserInfo user={data} />
          <HorizontalRule />
          <TabContentTitle
            title="Teams"
            subTitle="This user is a member of the following teams"
          />
          <List>
            {data?.teams.map((team) => (
              <ListItem key={team.id} to={`${baseUrl}/teams/${team.id}`}>
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
