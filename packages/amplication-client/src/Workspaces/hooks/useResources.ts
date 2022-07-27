import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import * as models from "../../models";
import { GET_RESOURCES } from "../queries/resourcesQuery";

type TData = {
  resources: models.Resource[];
};

const useResources = (currentProject: models.Project | undefined) => {
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

  return { resources, handleSearchChange, loadingResources, errorResources };
};

export default useResources;
