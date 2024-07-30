import { useQuery } from "@apollo/client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { GET_RESOURCES } from "../queries/modelsQueries";
import * as models from "../../../models";
import { AppContext } from "../../../context/appContext";
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
  const withTempResources = useRef<ResourceFilter[]>([]);

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
    if (withTempResources.current?.length > 0 && !resourcesData) {
      setFilteredResources(
        withTempResources.current.filter((x) => x.name.includes(searchPhrase))
      );
      return;
    }
    if (!resourcesData) {
      return;
    }

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
    filterArray.push(
      ...withTempResources.current.filter((x) => x.name.includes(searchPhrase))
    );
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

  const handleNewServiceSuccess = useCallback(
    (data: ResourceFilter) => {
      withTempResources.current.push(data);
      const updateResources = filteredResources.concat(data);
      setFilteredResources(updateResources);
    },
    [filteredResources, withTempResources, setFilteredResources]
  );

  const handleResourceFilterChanged = useCallback(
    (event, resource: ResourceFilter) => {
      const currentFilterResource = filteredResources.find(
        (x) => x.id === resource.id
      );
      currentFilterResource.isFilter = !currentFilterResource.isFilter;
      const currentResource = resourcesData.resources.find(
        (x) => x.id === resource.id
      );
      if (currentResource) {
        currentResource.isFilter = currentFilterResource.isFilter;
      }

      setFilteredResources((filteredResources) => [...filteredResources]);
    },
    [filteredResources, resourcesData, setFilteredResources]
  );

  return {
    resourcesData,
    loadingResources,
    resourcesError,
    refetchResourcesData,
    handleSearchChange,
    filteredResources,
    handleResourceFilterChanged,
    handleNewServiceSuccess,
    setSearchPhrase,
  };
};

export default useArchitectureConsole;
