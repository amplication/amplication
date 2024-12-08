import { useMutation } from "@apollo/client";
import { SEARCH_CATALOG } from "../../../Catalog/queries/catalogQueries";
import * as models from "../../../models";
import { CREATE_COMPONENT } from "../queries/ComponentQueries";
import useResourceSettings from "../../../ResourceSettings/hooks/useResourceSettings";
import { UPDATE_RESOURCE } from "../../../Workspaces/queries/resourcesQueries";

type Props = {
  onComponentCreated?: (component: models.Resource) => void;
};

const useCreateComponent = (props?: Props) => {
  const { onComponentCreated } = props || {};

  const { updateResourceSettings, updateError } = useResourceSettings();

  const [updateResource, { error: updateResourceError }] = useMutation<{
    updateResource: models.Resource;
  }>(UPDATE_RESOURCE);

  const [
    createComponentInternal,
    { loading: loadingCreateComponent, error: errorCreateComponent },
  ] = useMutation<{
    createComponent: models.Resource;
  }>(CREATE_COMPONENT, {
    refetchQueries: [SEARCH_CATALOG],
  });

  const createComponent = (
    data: models.ResourceCreateInput,
    catalogProperties?: Record<string, any>,
    settings?: models.ResourceSettingsUpdateInput
  ) => {
    createComponentInternal({
      variables: {
        data,
      },
    })
      .then(async (result) => {
        const promises = [];
        if (catalogProperties && Object.keys(catalogProperties).length > 0) {
          promises.push(
            updateResource({
              variables: {
                data: {
                  properties: catalogProperties,
                },
                resourceId: result.data?.createComponent?.id,
              },
            })
          );
        }

        if (settings && Object.keys(settings).length > 0) {
          promises.push(
            updateResourceSettings({
              variables: {
                data: {
                  ...settings,
                },
                resourceId: result.data?.createComponent?.id,
              },
            })
          );
        }
        await Promise.all(promises);

        result.data?.createComponent &&
          onComponentCreated &&
          onComponentCreated(result.data.createComponent);
      })
      .catch(console.error);
  };

  return {
    errorCreateComponent:
      errorCreateComponent || updateError || updateResourceError,
    createComponent,
    loadingCreateComponent,
  };
};

export default useCreateComponent;
