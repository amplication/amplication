import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  CREATE_RESOURCE_ENTITIES,
  GET_RESOURCES,
} from "../queries/modelsQueries";
import * as models from "../../../models";
import { AppContext } from "../../../context/appContext";
import { ModelChanges } from "../types";
import { ResourceFilter } from "../ArchitectureConsole";

type TData = {
  resources: ResourceFilter[];
};

const useArchitectureConsole = () => {
  const { currentProject } = useContext(AppContext);

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [filteredResources, setFilteredResources] = useState<ResourceFilter[]>(
    []
  );

  const {
    loading: loadingResources,
    error: resourcesError,
    data: resourcesData,
    refetch: refetchResourcesData,
  } = useQuery<TData>(GET_RESOURCES, {
    variables: {
      projectId: currentProject?.id,
      whereName:
        searchPhrase !== ""
          ? {
              contains: searchPhrase,
              mode: models.QueryMode.Insensitive,
            }
          : undefined,
    },

    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (!resourcesData) return;

    if (filteredResources.length > 0) {
      setFilteredResources([]);
    }
    const filterArray = [];
    resourcesData.resources.forEach((resource) => {
      resource.isFilter = true;
      const resourceFilter: ResourceFilter = {
        ...resource,
      };

      filterArray.push(resourceFilter);
    });
    setFilteredResources(filterArray);
  }, [resourcesData, setFilteredResources]);

  let timeout;

  const handleSearchChange = useCallback(
    (value) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setSearchPhrase(value);
      }, 750);
    },
    [setSearchPhrase, timeout]
  );

  const handleResourceFilterChanged = useCallback(
    (event, resource: ResourceFilter) => {
      const currentResource = resourcesData.resources.find(
        (x) => x.id === resource.id
      );
      currentResource.isFilter = !currentResource.isFilter;

      const currentFilterResource = filteredResources.find(
        (x) => x.id === resource.id
      );
      currentFilterResource.isFilter = currentResource.isFilter;

      setFilteredResources((filteredResources) => [...filteredResources]);
    },
    [filteredResources, resourcesData, setFilteredResources]
  );

  const [createResourceEntities, { error: createEntitiesError }] =
    useMutation<ModelChanges>(CREATE_RESOURCE_ENTITIES, {
      onCompleted: (data) => {
        refetchResourcesData();
      },
    });

  return {
    resourcesData,
    loadingResources,
    resourcesError,
    refetchResourcesData,
    createResourceEntities,
    createEntitiesError,
    handleSearchChange,
    filteredResources,
    handleResourceFilterChanged,
  };
};

export default useArchitectureConsole;
