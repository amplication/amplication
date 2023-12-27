import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useContext, useState } from "react";
import {
  CREATE_RESOURCE_ENTITIES,
  GET_RESOURCES,
} from "../queries/modelsQueries";
import * as models from "../../../models";
import { AppContext } from "../../../context/appContext";
import { ModelChanges } from "../types";

type TData = {
  resources: models.Resource[];
};

const useArchitectureConsole = () => {
  const { currentProject } = useContext(AppContext);

  const [searchPhrase, setSearchPhrase] = useState<string>("");

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
  };
};

export default useArchitectureConsole;
