import { useState, useEffect, useCallback } from "react";
import {
  FetchResult,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { useHistory, useParams, useLocation } from "react-router-dom";
import {
  GET_CURRENT_WORKSPACE,
  SET_CURRENT_WORKSPACE,
} from "../queries/workspaceQuery";
import { setToken, unsetToken } from "../../authentication/authentication";
import * as models from "../../models";

type TData = {
  currentWorkspace: models.Workspace;
};

type TSetData = {
  setServerCurrentWorkspace: {
    token: string;
  };
};

const useWorkspaceSelector = (authenticated: boolean) => {
  const apolloClient = useApolloClient();
  const history = useHistory();
  const location = useLocation();
  const { workspace } = useParams<{ workspace?: string }>();
  const [currentWorkspace, setCurrentWorkspace] = useState<models.Workspace>();
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

  const [setServerCurrentWorkspace, { data: setCurrentData }] = useMutation<
    TSetData
  >(SET_CURRENT_WORKSPACE);

  useEffect(() => {
    !authenticated && location.pathname === "/" && history.push("/login");

    authenticated && !currentWorkspace && getCurrentWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  useEffect(() => {
    if (loading && !authenticated) return;

    data &&
      data.currentWorkspace.id !== workspace &&
      history.push(`/${data.currentWorkspace.id}`);

    data &&
      data.currentWorkspace.id === workspace &&
      setCurrentWorkspace(data.currentWorkspace);
  }, [authenticated, data, history, loading, workspace]);

  useEffect(() => {
    if (setCurrentData) {
      apolloClient.clearStore();
      setToken(setCurrentData.setServerCurrentWorkspace.token);
      history.replace("/");
      window.location.reload();
    }
  }, [setCurrentData, history, apolloClient]);

  const handleSetCurrentWorkspace = useCallback(
    (workspaceId: string) => {
      setServerCurrentWorkspace({
        variables: {
          workspaceId: workspaceId,
        },
      })
        .then((results: FetchResult) => {
          // on success replace url with new workspace id
          // setCurrentWorkspace(new workspace)
          console.log(results, setCurrentWorkspace);
        })
        .catch((error) => console.log(error));
    },
    [setServerCurrentWorkspace]
  );

  return {
    currentWorkspace,
    loadingWorkspace: loading,
    handleSetCurrentWorkspace,
  };
};

export default useWorkspaceSelector;
