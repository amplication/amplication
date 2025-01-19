import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useCallback, useState } from "react";
import * as models from "../../models";
import {
  CREATE_SERVICE_TEMPLATE,
  CREATE_TEMPLATE_FROM_RESOURCE,
  GET_SERVICE_TEMPLATES,
  UPGRADE_SERVICE_TO_LATEST_TEMPLATE_VERSION,
} from "./serviceTemplateQueries";
import { GET_RESOURCES } from "../../Workspaces/queries/resourcesQueries";
import {
  GET_OUTDATED_VERSION_ALERT,
  GET_OUTDATED_VERSION_ALERTS,
} from "../../OutdatedVersionAlerts/hooks/outdatedVersionAlertsQueries";
import { useAppContext } from "../../context/appContext";

type TFindResourcesData = {
  resources: models.Resource[];
};

type TGetServiceTemplates = {
  serviceTemplates: models.Resource[];
};

type TCreateServiceTemplate = {
  createServiceTemplate: models.Resource;
};

type TUpgradeServiceToLatestTemplateVersion = {
  upgradeServiceToLatestTemplateVersion: models.Resource;
};

type TCreateTemplateFromExistingResourceData = {
  createTemplateFromExistingResource: models.Resource;
};

const useServiceTemplate = (
  currentProject?: models.Project | undefined,
  onServiceTemplateCreated?: (serviceTemplate: models.Resource) => void
) => {
  const { addBlock } = useAppContext();

  const [searchPhrase, setSearchPhrase] = useState<string>("");

  const [serviceTemplates, setServiceTemplates] = useState<models.Resource[]>(
    []
  );

  const {
    loading: loadingServiceTemplates,
    error: errorServiceTemplates,
    refetch: reloadServiceTemplates,
  } = useQuery<TGetServiceTemplates>(GET_SERVICE_TEMPLATES, {
    variables: {
      projectId: currentProject?.id,
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
    skip: !currentProject?.id,
    onCompleted: (data) => {
      setServiceTemplates(data.serviceTemplates);
    },
  });

  const [
    upgradeServiceToLatestTemplateVersionInternal,
    {
      loading: loadingUpgradeServiceToLatestTemplateVersion,
      error: errorUpgradeServiceToLatestTemplateVersion,
      data: UpgradeServiceToLatestTemplateVersionData,
    },
  ] = useMutation<TUpgradeServiceToLatestTemplateVersion>(
    UPGRADE_SERVICE_TO_LATEST_TEMPLATE_VERSION,
    {
      refetchQueries: [GET_OUTDATED_VERSION_ALERTS, GET_OUTDATED_VERSION_ALERT],
      onCompleted: (data) => {
        addBlock(data.upgradeServiceToLatestTemplateVersion.id);
      },
    }
  );

  const upgradeServiceToLatestTemplateVersion = (resourceId: string) => {
    upgradeServiceToLatestTemplateVersionInternal({
      variables: { resourceId },
    }).catch(console.error);
  };

  const [
    createServiceTemplateInternal,
    {
      loading: loadingCreateServiceTemplate,
      error: errorCreateServiceTemplate,
      data: createServiceTemplateData,
    },
  ] = useMutation<TCreateServiceTemplate>(CREATE_SERVICE_TEMPLATE, {});

  const createServiceTemplate = (data: models.ServiceTemplateCreateInput) => {
    createServiceTemplateInternal({ variables: { data: data } })
      .then((result) => {
        reloadServiceTemplates();
        addBlock(result.data.createServiceTemplate.id);
        onServiceTemplateCreated &&
          onServiceTemplateCreated(result.data.createServiceTemplate);
      })
      .catch(console.error);
  };

  const [
    createTemplateFromResourceInternal,
    {
      data: createTemplateFromResourceData,
      loading: loadingCreateTemplateFromResource,
      error: errorCreateTemplateFromResource,
    },
  ] = useMutation<TCreateTemplateFromExistingResourceData>(
    CREATE_TEMPLATE_FROM_RESOURCE
  );

  const createTemplateFromResource = (resourceId: string) => {
    createTemplateFromResourceInternal({
      variables: {
        resourceId: resourceId,
      },
    })
      .then((result) => {
        reloadServiceTemplates();
        addBlock(result.data.createTemplateFromExistingResource.id);
        onServiceTemplateCreated &&
          onServiceTemplateCreated(
            result.data.createTemplateFromExistingResource
          );
      })
      .catch(console.error);
  };

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );

  const [
    findResourcesByTemplateInternal,
    {
      data: findResourcesByTemplateData,
      loading: findResourcesByTemplateLoading,
      error: findResourcesByTemplateError,
      refetch: findResourcesByTemplateRefetch,
    },
  ] = useLazyQuery<TFindResourcesData>(GET_RESOURCES);

  const findResourcesByTemplate = (templateId: string) => {
    findResourcesByTemplateInternal({
      variables: {
        where: {
          serviceTemplateId: templateId,
        },
      },
    });
  };

  return {
    serviceTemplates: serviceTemplates,
    handleSearchChange,
    loadingServiceTemplates,
    errorServiceTemplates,
    reloadServiceTemplates,
    createServiceTemplate,
    loadingCreateServiceTemplate,
    errorCreateServiceTemplate,
    createdServiceTemplateResults: createServiceTemplateData,
    findResourcesByTemplate,
    findResourcesByTemplateData: findResourcesByTemplateData?.resources,
    findResourcesByTemplateLoading,
    findResourcesByTemplateError,
    findResourcesByTemplateRefetch,
    upgradeServiceToLatestTemplateVersion,
    loadingUpgradeServiceToLatestTemplateVersion,
    errorUpgradeServiceToLatestTemplateVersion,
    upgradeServiceToLatestTemplateVersionData:
      UpgradeServiceToLatestTemplateVersionData?.upgradeServiceToLatestTemplateVersion,
    createTemplateFromResource,
    loadingCreateTemplateFromResource,
    errorCreateTemplateFromResource,
    createTemplateFromResourceData,
  };
};

export default useServiceTemplate;
