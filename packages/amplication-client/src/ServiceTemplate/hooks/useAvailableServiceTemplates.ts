import { useQuery } from "@apollo/client";
import * as models from "../../models";
import { GET_AVAILABLE_TEMPLATES_FOR_PROJECT } from "./serviceTemplateQueries";

type TFindData = {
  availableTemplatesForProject: models.Resource[];
};

const useAvailableServiceTemplates = (
  currentProject: models.Project | undefined
) => {
  const {
    data: availableTemplatesData,
    loading: availableTemplatesLoading,
    error: availableTemplatesError,
    refetch: availableTemplatesRefetch,
  } = useQuery<TFindData>(GET_AVAILABLE_TEMPLATES_FOR_PROJECT, {
    variables: {
      projectId: currentProject?.id,
    },
    skip: !currentProject?.id,
  });

  return {
    availableTemplates:
      availableTemplatesData?.availableTemplatesForProject || [],
    availableTemplatesLoading,
    availableTemplatesError,
    availableTemplatesRefetch,
  };
};

export default useAvailableServiceTemplates;
