import { useMutation } from "@apollo/client";
import * as models from "../../models";
import { CREATE_SERVICE_WITH_ENTITIES } from "../../Workspaces/queries/resourcesQueries";

type TCreateService = {
  createServiceWithEntities: models.ResourceCreateWithEntitiesResult;
};

const useOnboardingPreview = () => {
  const [
    createService,
    { loading: loadingCreateService, error: errorCreateService },
  ] = useMutation<TCreateService>(CREATE_SERVICE_WITH_ENTITIES);

  return {
    createService,
    loadingCreateService,
    errorCreateService,
  };
};

export default useOnboardingPreview;
