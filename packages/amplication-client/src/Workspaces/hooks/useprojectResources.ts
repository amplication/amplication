import { useLazyQuery } from "@apollo/client";
import * as models from "../../models";
import { GET_RESOURCES } from "../queries/resourcesQueries";

type TGetResources = {
  resources: models.Resource[];
};

const useProjectResources = () => {
  const [
    getResources,
    {
      data: projectResourcesData,
      loading: loadingProjectResources,
      error: errorProjectResources,
    },
  ] = useLazyQuery<TGetResources>(GET_RESOURCES, {});

  const getProjectResources = (projectId: string) => {
    getResources({
      variables: {
        projectId,
      },
    });
  };

  return {
    getProjectResources,
    projectResourcesData,
    loadingProjectResources,
    errorProjectResources,
  };
};

export default useProjectResources;
