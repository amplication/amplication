import { useMutation } from "@apollo/client";
import { SEARCH_CATALOG } from "../../../Catalog/queries/catalogQueries";
import * as models from "../../../models";
import { CREATE_COMPONENT } from "../queries/ComponentQueries";
import useResourceSettings from "../../../ResourceSettings/hooks/useResourceSettings";
import {
  CREATE_SERVICE_FROM_TEMPLATE,
  UPDATE_RESOURCE,
} from "../../../Workspaces/queries/resourcesQueries";

type Props = {
  onResourceCreated?: (resource: models.Resource) => void;
};

const useCreateResource = (props?: Props) => {
  const { onResourceCreated } = props || {};

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

  const [
    createServiceFromTemplateInternal,
    {
      loading: loadingCreateServiceFromTemplate,
      error: errorCreateServiceFromTemplate,
    },
  ] = useMutation<{
    createResourceFromTemplate: models.Resource;
  }>(CREATE_SERVICE_FROM_TEMPLATE, {});

  const createResource = (
    data: models.ResourceCreateInput,
    templateId: string,
    catalogProperties?: Record<string, any>,
    settings?: models.ResourceSettingsUpdateInput
  ) => {
    if (templateId) {
      createServiceFromTemplateInternal({
        variables: {
          data: {
            name: data.name,
            description: data.description,
            project: data.project,
            serviceTemplate: { id: templateId },
          },
        },
      })
        .then(async (result) => {
          if (result.data?.createResourceFromTemplate) {
            await saveResourceSettings(
              result.data.createResourceFromTemplate,
              catalogProperties,
              settings
            );

            onResourceCreated &&
              onResourceCreated(result.data.createResourceFromTemplate);
          }
        })
        .catch(console.error);
    } else {
      createComponentInternal({
        variables: {
          data,
        },
      })
        .then(async (result) => {
          if (result.data?.createComponent) {
            await saveResourceSettings(
              result.data.createComponent,
              catalogProperties,
              settings
            );

            onResourceCreated && onResourceCreated(result.data.createComponent);
          }
        })
        .catch(console.error);
    }
  };

  const saveResourceSettings = async (
    resource: models.Resource,
    catalogProperties?: Record<string, any>,
    settings?: models.ResourceSettingsUpdateInput
  ) => {
    const promises = [];
    if (catalogProperties && Object.keys(catalogProperties).length > 0) {
      promises.push(
        updateResource({
          variables: {
            data: {
              properties: catalogProperties,
            },
            resourceId: resource.id,
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
            resourceId: resource.id,
          },
        })
      );
    }
    return Promise.all(promises);
  };

  return {
    errorCreateResource:
      errorCreateComponent ||
      updateError ||
      updateResourceError ||
      errorCreateServiceFromTemplate,
    createResource,
    loadingCreateResource:
      loadingCreateComponent || loadingCreateServiceFromTemplate,
  };
};

export default useCreateResource;
