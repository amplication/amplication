import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import * as models from "../../models";
import { PURCHASE_URL } from "../../routes/routesUtil";
import { expireCookie, getCookie, setCookie } from "../../util/cookie";
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
    "/:workspace([A-Za-z0-9-]{20,})/purchase",
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
  const [currentProjectConfiguration, setCurrentProjectConfiguration] =
    useState<models.Resource>();
  const {
    data: projectListData,
    loading: loadingList,
    refetch,
  } = useQuery<{
    projects: models.Project[];
  }>(GET_PROJECTS, {
    skip:
      !workspace ||
      (currentWorkspace && currentWorkspace?.id !== workspace) ||
      !currentWorkspace,
    onError: (error) => {
      // if error push to ? check with @Yuval
    },
  });

  const projectRedirect = useCallback(
    (projectId: string, search?: string) =>
      (currentWorkspace?.id || workspace) &&
      history.push({
        pathname: `/${currentWorkspace?.id || workspace}/${projectId}`,
        search: search || "",
      }),
    [currentWorkspace?.id, history, workspace]
  );

  const [setNewProject] =
    useMutation<models.ProjectCreateInput>(CREATE_PROJECT);

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
    const signupCookie = getCookie("signup");

    if (signupCookie) {
      let refreshTimes = Number(signupCookie);
      refreshTimes += 1;
      if (refreshTimes < 4) {
        setCookie("signup", refreshTimes.toString());
      } else {
        expireCookie("signup");
      }
    }
  }, []);

  useEffect(() => {
    if (loadingList || !projectListData) return;

    const sortedProjects = [...projectListData.projects].sort((a, b) => {
      return Date.parse(b.createdAt) - Date.parse(a.createdAt);
    });

    setProjectList(sortedProjects);
  }, [projectListData, loadingList]);

  useEffect(() => {
    if (currentProject || project || !projectsList.length) return;

    const isFromSignup = location.search.includes("complete-signup=1");
    const isSignupCookieExist = getCookie("signup");
    !isSignupCookieExist && isFromSignup && setCookie("signup", "1");
    const isFromPurchase = localStorage.getItem(PURCHASE_URL);

    if (isFromPurchase) {
      localStorage.removeItem(PURCHASE_URL);
      return history.push({
        pathname: `/${currentWorkspace?.id}/purchase`,
        state: { source: "redirect" },
      });
    }

    !!(!workspaceUtil && currentWorkspace?.id) &&
      history.push(
        `/${currentWorkspace?.id}/${projectsList[0].id}${
          isFromSignup || isSignupCookieExist ? "/welcome" : ""
        }`
      );
  }, [
    currentWorkspace?.id,
    history,
    project,
    projectRedirect,
    projectsList,
    workspace,
  ]);

  useEffect(() => {
    if (
      !project ||
      !projectsList.length ||
      projectListData.projects.length !== projectsList.length
    )
      return;

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
    refetchProjects: refetch,
  };
};

export default useProjectSelector;
