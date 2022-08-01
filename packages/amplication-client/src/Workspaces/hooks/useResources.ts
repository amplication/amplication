import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import * as models from "../../models";
import { GET_RESOURCES } from "../queries/resourcesQueries";

type TData = {
  resources: models.Resource[];
};

const useResources = (currentWorkspace: models.Workspace | undefined, currentProject: models.Project | undefined) => {
  const history = useHistory()
  const resourceMatch: { params: { resource: string } } | null = useRouteMatch<{
    resource: string;
  }>(
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})"
  );
  const [currentResource, setCurrentResource] = useState<models.Resource>();
  console.log(resourceMatch); // will be using next issue
  const [resources, setResources] = useState<models.Resource[]>([]);
  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const {
    data: resourcesData,
    loading: loadingResources,
    error: errorResources,
  } = useQuery<TData>(GET_RESOURCES, {
    variables: {
      projectId: currentProject?.id,
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
    skip: !currentProject,
  });

  useEffect(() => {
    if (loadingResources || !resourcesData) return;
    setResources(resourcesData.resources);
  }, [resourcesData, loadingResources]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const setResource = useCallback((resource: models.Resource) => {
    setCurrentResource(resource)
    currentWorkspace && currentProject && history.push(`/${currentWorkspace.id}/${currentProject.id}/${resource.id}`)
  }, [currentProject, currentWorkspace, history])

  return {
    resources,
    handleSearchChange,
    loadingResources,
    errorResources,
    currentResource,
    setResource,
  };
};

export default useResources;
