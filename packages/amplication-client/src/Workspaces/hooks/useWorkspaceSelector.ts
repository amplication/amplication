import { useState, useEffect, useCallback } from "react";
import {
  FetchResult,
  Reference,
  useApolloClient,
  useLazyQuery,
  useMutation,
} from "@apollo/client";
import { useHistory, useParams, useLocation } from "react-router-dom";
import {
  CREATE_WORKSPACE,
  GET_CURRENT_WORKSPACE,
  NEW_WORKSPACE_FRAGMENT,
  SET_CURRENT_WORKSPACE,
} from "../queries/workspaceQueries";
import { setToken, unsetToken } from "../../authentication/authentication";
import * as models from "../../models";
import { CreateWorkspaceType, DType, TData, TSetData } from "./workspace";
import { useTracking } from "react-tracking";

const useWorkspaceSelector = (authenticated: boolean) => {
  const apolloClient = useApolloClient();
  const { trackEvent } = useTracking();
  const history = useHistory();
  const location = useLocation();
  const { workspace } = useParams<{ workspace?: string }>();
  const [currentWorkspace, setCurrentWorkspace] = useState<models.Workspace>();
  const [
    getCurrentWorkspace,
    { loading: loadingCurrentWorkspace, data, refetch },
  ] = useLazyQuery<TData>(GET_CURRENT_WORKSPACE, {
    onError: (error) => {
      if (error.message === "Unauthorized") {
        unsetToken();
        history.push("/login");
      }
    },
  });

  useEffect(() => {}, [currentWorkspace]);

  const refreshCurrentWorkspace = useCallback(() => {
    data && refetch && refetch();
  }, [refetch, data]);

  const [setServerCurrentWorkspace, { data: setCurrentData }] = useMutation<
    TSetData
  >(SET_CURRENT_WORKSPACE);

  const [
    createNewWorkspace,
    { error: createNewWorkspaceError, loading: loadingCreateNewWorkspace },
  ] = useMutation<DType>(CREATE_WORKSPACE, {
    onCompleted: (data) => {
      trackEvent({
        eventName: "createWorkspace",
        workspaceName: data.createWorkspace.name,
      });
      handleSetCurrentWorkspace(data.createWorkspace.id);
    },
    update(cache, { data }) {
      if (!data) return;

      const newWorkspace = data.createWorkspace;

      cache.modify({
        fields: {
          workspaces(existingWorkspaceRefs = [], { readField }) {
            const newWorkspaceRef = cache.writeFragment({
              data: newWorkspace,
              fragment: NEW_WORKSPACE_FRAGMENT,
            });

            if (
              existingWorkspaceRefs.some(
                (WorkspaceRef: Reference) =>
                  readField("id", WorkspaceRef) === newWorkspace.id
              )
            ) {
              return existingWorkspaceRefs;
            }

            return [...existingWorkspaceRefs, newWorkspaceRef];
          },
        },
      });
    },
  });

  const createWorkspace = useCallback(
    (data: CreateWorkspaceType) => {
      createNewWorkspace({
        variables: {
          data,
        },
      }).catch(console.error);
    },
    [createNewWorkspace]
  );

  useEffect(() => {
    !authenticated &&
      location.pathname === "/" &&
      !currentWorkspace &&
      history.push("/login");

    authenticated && !currentWorkspace && getCurrentWorkspace();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  useEffect(() => {
    if (loadingCurrentWorkspace && !authenticated) return;

    data &&
      data.currentWorkspace.id !== workspace &&
      history.push({
        pathname: `/${data.currentWorkspace.id}`,
        search: location.search,
      });

    data &&
      data.currentWorkspace.id === workspace &&
      setCurrentWorkspace(data.currentWorkspace);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, data, history, loadingCurrentWorkspace, workspace]);

  useEffect(() => {
    if (setCurrentData) {
      apolloClient.clearStore();
      setToken(setCurrentData.setCurrentWorkspace.token);
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
          !results && history.push("/login");
        })
        .catch((error) => console.log(error));
    },
    [history, setServerCurrentWorkspace]
  );

  return {
    currentWorkspace,
    loadingWorkspace: loadingCurrentWorkspace,
    handleSetCurrentWorkspace,
    createWorkspace,
    createNewWorkspaceError,
    loadingCreateNewWorkspace,
    refreshCurrentWorkspace,
  };
};

export default useWorkspaceSelector;
