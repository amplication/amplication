import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  CREATE_RESOURCE_ENTITIES,
  GET_RESOURCES,
} from "../queries/modelsQueries";
import * as models from "../../../models";
import { AppContext } from "../../../context/appContext";
import { ModelChanges } from "../types";
import { ResourceFilter } from "../ArchitectureConsole";
import { CREATE_SERVICE } from "../../../Workspaces/queries/resourcesQueries";
import { EnumAuthProviderType, EnumResourceType } from "../../../models";

type TData = {
  resources: ResourceFilter[];
};

type TCreateService = {
  createTempService: models.Resource;
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

  const [
    createService,
    { loading: loadingCreateService, error: errorCreateService },
  ] = useMutation<TCreateService>(CREATE_SERVICE, {});

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

  const [
    createResourceEntities,
    { loading: loadingCreateEntities, error: createEntitiesError },
  ] = useMutation<ModelChanges>(CREATE_RESOURCE_ENTITIES, {
    onCompleted: (data) => {
      withTempResources.current = [];
      refetchResourcesData();
    },
  });

  const handleApplyPlanProcess = useCallback(async (data: ModelChanges) => {
    for (const service of data.newServices) {
      await createService({
        variables: {
          data: {
            name: service.name,
            description: `create service: ${service.name} from architecture model`,
            tempId: service.id,
            resourceType: EnumResourceType.Service,
            serviceSettings: {
              adminUISettings: {
                generateAdminUI: false,
                adminUIPath: "",
              },
              serverSettings: {
                generateGraphQL: true,
                generateRestApi: true,
                serverPath: "",
              },
              authProvider: EnumAuthProviderType.Jwt,
            },
            project: {
              connect: {
                id: currentProject.id,
              },
            },
          },
        },
      })
        .then((result) => {
          //update target resourceId in moveEntities list
          data.movedEntities.find(
            (e) => e.targetResourceId === result.data.createTempService.tempId
          ).targetResourceId = result.data.createTempService.id;
        })
        .catch(console.error);
    }

    await createResourceEntities({
      variables: {
        data: {
          entitiesToCopy: data.movedEntities,
        },
      },
    }).catch(console.error);
  }, []);

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
    createService,
    loadingCreateService,
    loadingCreateEntities,
    errorCreateService,
    handleNewServiceSuccess,
    handleApplyPlanProcess,
  };
};

export default useArchitectureConsole;
