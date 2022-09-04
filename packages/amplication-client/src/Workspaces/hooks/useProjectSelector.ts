import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import * as models from "../../models";
import { CREATE_PROJECT, GET_PROJECTS } from "../queries/projectQueries";

const useProjectSelector = (
  authenticated: boolean,
  currentWorkspace: models.Workspace | undefined
) => {
  const history = useHistory();
  const location = useLocation();
  const workspaceMatch: {
    params: { workspace: string };
  } | null = useRouteMatch<{ workspace: string }>(
    "/:workspace([A-Za-z0-9-]{20,})"
  );
  const workspaceUtil = useRouteMatch([
    "/:workspace([A-Za-z0-9-]{20,})/settings",
    "/:workspace([A-Za-z0-9-]{20,})/members",
  ]);
  const projectMatch: {
    params: { workspace: string; project: string };
  } | null = useRouteMatch<{ workspace: string; project: string }>(
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})"
  );
  const project = projectMatch?.params?.project;
  const workspace =
    projectMatch?.params?.workspace || workspaceMatch?.params.workspace;
  const [currentProject, setCurrentProject] = useState<models.Project>();
  const [projectsList, setProjectList] = useState<models.Project[]>([]);
  const [
    currentProjectConfiguration,
    setCurrentProjectConfiguration,
  ] = useState<models.Resource>();
  const { data: projectListData, loading: loadingList, refetch } = useQuery<{
    projects: models.Project[];
  }>(GET_PROJECTS, {
    skip:
      !workspace || (currentWorkspace && currentWorkspace?.id !== workspace),
    onError: (error) => {
      // if error push to ? check with @Yuval
    },
  });

  const projectRedirect = useCallback(
    (projectId: string, search?: string) =>
      history.push({
        pathname: `/${currentWorkspace?.id || workspace}/${projectId}`,
        search: search || "",
      }),
    [currentWorkspace?.id, history, workspace]
  );

  const [setNewProject] = useMutation<models.ProjectCreateInput>(
    CREATE_PROJECT
  );

  const createProject = (data: models.ProjectCreateInput) => {
    setNewProject({ variables: data });
  };

  const onNewProjectCompleted = useCallback(
    (data: models.Project) => {
      refetch().then(() => projectRedirect(data.id));
    },
    [projectRedirect, refetch]
  );

  useEffect(() => {
    if (loadingList || !projectListData) return;

    setProjectList(projectListData.projects);
  }, [projectListData, loadingList]);

  useEffect(() => {
    if (currentProject || project || !projectsList.length) return;

    const isFromSignup = location.search.includes("complete-signup=1");
    !workspaceUtil &&
      history.push(
        `/${currentWorkspace?.id}/${projectsList[0].id}${
          isFromSignup ? "/create-resource" : ""
        }`
      );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentWorkspace?.id,
    history,
    project,
    projectRedirect,
    projectsList,
    workspace,
  ]);

  useEffect(() => {
    if (!project || !projectsList.length) return;

    const selectedProject = projectsList.find(
      (projectDB: models.Project) => projectDB.id === project
    );
    if (!selectedProject) projectRedirect(projectsList[0].id);

    setCurrentProject(selectedProject);

    setCurrentProjectConfiguration(
      selectedProject?.resources?.find(
        (resource) =>
          resource.resourceType === models.EnumResourceType.ProjectConfiguration
      )
    );
  }, [project, projectRedirect, projectsList]);

  return {
    currentProject,
    projectsList,
    createProject,
    onNewProjectCompleted,
    currentProjectConfiguration,
  };
};

export default useProjectSelector;
