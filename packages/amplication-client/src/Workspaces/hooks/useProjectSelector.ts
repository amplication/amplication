import { useLazyQuery, useMutation } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import * as models from "../../models";
import { CREATE_PROJECT, GET_PROJECTS } from "../queries/projectQuery";

type TData = {
  projects: models.Project[];
};

type TSetData = {
  data: {
    name: string;
  };
};

const useProjectSelector = (
  authenticated: boolean,
  currentWorkspace: models.Workspace | undefined
) => {
  const history = useHistory();
  const { project } = useParams<{ project?: string; resource?: string }>();
  const [currentProject, setCurrentProject] = useState<models.Project>();
  const [projectsList, setProjectList] = useState<models.Project[]>([]);
  const [
    getProjectList,
    { loading: loadingList, data: projectListData },
  ] = useLazyQuery<TData>(GET_PROJECTS, {
    onError: (error) => {
      // if error push to ? check with @Yuval
    },
  });
  const [setNewProject, { data: newProjectRes }] = useMutation<TSetData>(
    CREATE_PROJECT
  );

  const findCurrentProject = useCallback(
    (projects: models.Project[]) => {
      const selectedProject = projects.reduce(
        (selected: models.Project | null, proj: models.Project) => {
          if (!selected && !project) selected = proj;

          if (project && proj.id === project) selected = proj;

          return selected;
        },
        null
      );

      selectedProject && setCurrentProject(selectedProject);
      currentWorkspace &&
        history.push(
          `/${currentWorkspace.id}/${
            selectedProject ? selectedProject.id : projects[0].id
          }`
        );
    },
    [currentWorkspace, history, project]
  );

  useEffect(() => {
    if (!currentWorkspace) return;

    getProjectList({
      variables: {
        id: currentWorkspace.id,
      },
    });
  }, [currentWorkspace, getProjectList]);

  useEffect(() => {
    if (loadingList || !projectListData) return;

    setProjectList(projectListData.projects);
    findCurrentProject(projectListData.projects);
  }, [loadingList, projectListData, findCurrentProject]);

  return {
    currentProject,
    projectsList,
    setNewProject,
    newProjectRes,
  };
};

export default useProjectSelector;
