import { useLazyQuery } from "@apollo/client";
import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { unsetToken } from "../../authentication/authentication";
import * as models from "../../models";
import { GET_CURRENT_WORKSPACE } from "../queries/workspaceQueries";

type TData = {
  currentWorkspace: models.Workspace;
};

const useCurrentWorkspace = (authenticated: boolean) => {
  const history = useHistory();
  const location = useLocation();
  const [getCurrentWorkspace, { loading, data }] = useLazyQuery<TData>(
    GET_CURRENT_WORKSPACE,
    {
      onError: (error) => {
        if (error.message === "Unauthorized") {
          unsetToken();
          history.push("/login");
        }
      },
    }
  );

  useEffect(() => {
    if (location.pathname !== "/") return;

    !authenticated && location.pathname === "/" && history.push("/login");

    authenticated && getCurrentWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, location.pathname]);

  useEffect(() => {
    if (!(data && data.currentWorkspace)) return;
    location.pathname === "/" &&
      history.push({
        pathname: `/${data.currentWorkspace.id}`,
        search: location.search,
      });
  }, [data, history, location]);

  return {
    currentWorkspaceLoad: location.pathname === "/" ? loading : null,
  };
};

export default useCurrentWorkspace;
