import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { match, useHistory, useRouteMatch } from "react-router-dom";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { expireCookie } from "../../util/cookie";
import {
  CREATE_SERVICE_WITH_ENTITIES,
  GET_RESOURCES,
  CREATE_MESSAGE_BROKER,
  CREATE_SERVICE_FROM_TEMPLATE,
} from "../queries/resourcesQueries";
import { getGitRepositoryDetails } from "../../util/git-repository-details";
import { GET_PROJECTS } from "../queries/projectQueries";
import { UPDATE_CODE_GENERATOR_VERSION } from "../../Resource/codeGeneratorVersionSettings/queries";
import { CREATE_PLUGIN_REPOSITORY } from "../queries/pluginRepositoryQueries";
import { useProjectBaseUrl } from "../../util/useProjectBaseUrl";

type TGetResources = {
  resources: models.Resource[];
};

type TCreateService = {
  createServiceWithEntities: models.ResourceCreateWithEntitiesResult;
};

type TCreateServiceFromTemplate = {
  createResourceFromTemplate: models.Resource;
};

export type TUpdateCodeGeneratorVersion = {
  updateCodeGeneratorVersion: {
    codeGeneratorStrategy: models.CodeGeneratorVersionStrategy | null;
    codeGeneratorVersion: string | null;
  };
  resourceId: string;
};

type TCreateMessageBroker = {
  createMessageBroker: models.Resource;
};

type TCreatePluginRepository = {
  createPluginRepository: models.Resource;
};

const createGitRepositoryFullName = (
  provider: models.EnumGitProvider,
  gitRepository: models.Maybe<models.GitRepository> | undefined
) => {
  if (!gitRepository && !gitRepository?.gitOrganization)
    return "Connect to Git Provider";

  switch (provider) {
    case models.EnumGitProvider.Github:
      return `${gitRepository?.gitOrganization?.name}/${gitRepository.name}`;
    case models.EnumGitProvider.Bitbucket:
      return `${gitRepository.groupName}/${gitRepository.name}`;
    case models.EnumGitProvider.AwsCodeCommit:
      return `${gitRepository.name}`;
    case models.EnumGitProvider.GitLab:
      return `${gitRepository.groupName}/${gitRepository.name}`;
    case models.EnumGitProvider.AzureDevOps:
      return `${gitRepository.groupName}/${gitRepository.name}`;
  }
};

const useResources = (
  currentWorkspace: models.Workspace | undefined,
  currentProject: models.Project | undefined,
  addBlock: (id: string) => void,
  addEntity: (id: string) => void
) => {
  const history = useHistory();
  const { trackEvent } = useTracking();
  const resourceMatch:
    | (match & {
        params: { workspace: string; project: string; resource: string };
      })
    | null = useRouteMatch<{
    workspace: string;
    project: string;
    resource: string;
  }>([
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})",
    "/:workspace([A-Za-z0-9-]{20,})/platform/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})",
  ]);
  const createResourceMatch:
    | (match & {
        params: { workspace: string; project: string };
      })
    | null = useRouteMatch<{
    workspace: string;
    project: string;
  }>(
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/create-resource"
  );
  const { baseUrl: projectBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: false,
  });
  const { baseUrl: platformProjectBaseUrl } = useProjectBaseUrl({
    overrideIsPlatformConsole: true,
  });

  const [currentResource, setCurrentResource] = useState<models.Resource>();
  const [createServiceWithEntitiesResult, setCreateServiceWithEntitiesResult] =
    useState<models.ResourceCreateWithEntitiesResult>();

  const [resources, setResources] = useState<models.Resource[]>([]);
  const [projectConfigurationResource, setProjectConfigurationResource] =
    useState<models.Resource | undefined>(undefined);

  const [pluginRepositoryResource, setPluginRepositoryResource] = useState<
    models.Resource | undefined
  >(undefined);

  const [gitRepositoryFullName, setGitRepositoryFullName] = useState<string>(
    createGitRepositoryFullName(
      currentResource?.gitRepository?.gitOrganization?.provider,
      currentResource?.gitRepository
    )
  );

  const [gitRepositoryUrl, setGitRepositoryUrl] = useState<string>("");
  const [
    gitRepositoryOrganizationProvider,
    setGitRepositoryOrganizationProvider,
  ] = useState<models.EnumGitProvider>(undefined);

  const {
    data: resourcesData,
    loading: loadingResources,
    error: errorResources,
    refetch: reloadResources,
  } = useQuery<TGetResources>(GET_RESOURCES, {
    variables: {
      where: {
        project: { id: currentProject?.id },
      } as models.ResourceWhereInputWithPropertiesFilter,
    },
    skip: !currentProject?.id,
  });

  const resourceRedirect = useCallback(
    (resourceId: string) => {
      history.push({
        pathname: `${projectBaseUrl}/${resourceId}`, //todo:change the route
      });
    },
    [projectBaseUrl, history]
  );

  const [
    createServiceWithEntities,
    { loading: loadingCreateService, error: errorCreateService },
  ] = useMutation<TCreateService>(CREATE_SERVICE_WITH_ENTITIES, {
    refetchQueries: [
      {
        query: GET_PROJECTS,
      },
    ],
  });

  const updateCodeGeneratorVersion = (input: TUpdateCodeGeneratorVersion) => {
    updateCodeGeneratorVersionMutation({
      variables: {
        data: {
          codeGeneratorVersionOptions: {
            ...input.updateCodeGeneratorVersion,
          },
        },
        where: {
          id: input.resourceId,
        },
      },
    }).then(() => {
      addEntity(input.resourceId);
    });
  };

  const [
    updateCodeGeneratorVersionMutation,
    {
      loading: loadingUpdateCodeGeneratorVersion,
      error: errorUpdateCodeGeneratorVersion,
    },
  ] = useMutation<TUpdateCodeGeneratorVersion>(UPDATE_CODE_GENERATOR_VERSION, {
    onCompleted: (data) => {
      setResources((currentResources) => {
        if (!currentResources) return currentResources;

        return currentResources.map((resource) => {
          if (resource.id === currentResource.id) {
            return {
              ...resource,
              codeGeneratorVersion:
                data.updateCodeGeneratorVersion.codeGeneratorVersion,
              codeGeneratorStrategy:
                data.updateCodeGeneratorVersion.codeGeneratorStrategy,
            };
          }
          return resource;
        });
      });
    },
  });

  const createService = (
    data: models.ResourceCreateWithEntitiesInput,
    eventName: AnalyticsEventNames
  ) => {
    trackEvent({
      eventName: eventName,
    });
    createServiceWithEntities({ variables: { data: data } })
      .then((result) => {
        if (!result.data?.createServiceWithEntities.resource.id) return;

        setCreateServiceWithEntitiesResult(
          result.data?.createServiceWithEntities
        );

        const currentResourceId =
          result.data?.createServiceWithEntities.resource.id;
        addEntity(currentResourceId);
        setCurrentResource(result.data?.createServiceWithEntities.resource);
        expireCookie("signup");
        reloadResources();
      })
      .catch(console.error);
  };

  const [
    createPluginRepositoryInternal,
    {
      loading: loadingCreatePluginRepository,
      error: errorCreatePluginRepository,
    },
  ] = useMutation<TCreatePluginRepository>(CREATE_PLUGIN_REPOSITORY, {});

  const createPluginRepository = (data: models.ResourceCreateInput) => {
    trackEvent({
      eventName: AnalyticsEventNames.CreatePluginRepository,
    });
    createPluginRepositoryInternal({ variables: { data: data } }).then(
      (result) => {
        result.data?.createPluginRepository.id &&
          addBlock(result.data.createPluginRepository.id);
        result.data?.createPluginRepository.id &&
          reloadResources().then(() => {
            history.push({
              pathname: `${platformProjectBaseUrl}/private-plugins/git-settings`,
            });
          });
      }
    );
  };

  const [
    createBroker,
    { loading: loadingCreateMessageBroker, error: errorCreateMessageBroker },
  ] = useMutation<TCreateMessageBroker>(CREATE_MESSAGE_BROKER, {});

  const createMessageBroker = (
    data: models.ResourceCreateInput,
    eventName: AnalyticsEventNames
  ) => {
    trackEvent({
      eventName: eventName,
    });
    createBroker({ variables: { data: data } }).then((result) => {
      result.data?.createMessageBroker.id &&
        addBlock(result.data.createMessageBroker.id);
      result.data?.createMessageBroker.id &&
        reloadResources().then(() => {
          resourceRedirect(result.data?.createMessageBroker.id as string);
        });
    });
  };

  useEffect(() => {
    if (resourceMatch || createResourceMatch) return;

    currentResource && setCurrentResource(undefined);
    projectConfigurationResource &&
      setGitRepositoryFullName(
        createGitRepositoryFullName(
          projectConfigurationResource?.gitRepository?.gitOrganization
            ?.provider,
          projectConfigurationResource?.gitRepository
        )
      );
    setGitRepositoryUrl(
      getGitRepositoryDetails({
        organization:
          projectConfigurationResource?.gitRepository?.gitOrganization,
        repositoryName: projectConfigurationResource?.gitRepository?.name,
        groupName: projectConfigurationResource?.gitRepository?.groupName,
      }).repositoryUrl
    );
    setGitRepositoryOrganizationProvider(
      projectConfigurationResource?.gitRepository?.gitOrganization?.provider
    );
  }, [
    createResourceMatch,
    resourceMatch,
    currentResource,
    projectConfigurationResource,
    gitRepositoryFullName,
  ]);

  useEffect(() => {
    if (!resourceMatch || !projectConfigurationResource) return;

    const urlResource =
      resourceMatch && resourceMatch.params && resourceMatch.params.resource;
    const resource = [...resources, projectConfigurationResource].find(
      (resource: models.Resource) => resource.id === urlResource
    );

    if (!resource) {
      //reload resources but do not redirect to prevent an infinite loop
      //this may be needed if the resource was created on the server side and is not known to the client yet
      reloadResources();
    }

    setCurrentResource(resource);
    setGitRepositoryFullName(
      createGitRepositoryFullName(
        resource?.gitRepository?.gitOrganization?.provider,
        resource?.gitRepository
      )
    );
    setGitRepositoryUrl(
      getGitRepositoryDetails({
        organization: resource?.gitRepository?.gitOrganization,
        repositoryName: resource?.gitRepository?.name,
        groupName: resource?.gitRepository?.groupName,
      }).repositoryUrl
    );
    setGitRepositoryOrganizationProvider(
      resource?.gitRepository?.gitOrganization?.provider
    );
  }, [
    reloadResources,
    resourceMatch,
    resources,
    projectConfigurationResource,
    gitRepositoryFullName,
  ]);

  useEffect(() => {
    if (loadingResources || !resourcesData) return;

    const pluginRepositoryResource = resourcesData.resources.find(
      (r) => r.resourceType === models.EnumResourceType.PluginRepository
    );
    setPluginRepositoryResource(pluginRepositoryResource);

    const projectConfigurationResource = resourcesData.resources.find(
      (r) => r.resourceType === models.EnumResourceType.ProjectConfiguration
    );
    setProjectConfigurationResource(projectConfigurationResource);

    const resources = resourcesData.resources.filter(
      (r) =>
        ![
          models.EnumResourceType.ProjectConfiguration,
          models.EnumResourceType.PluginRepository,
        ].includes(r.resourceType)
    );
    setResources(resources);
  }, [resourcesData, loadingResources]);

  // ***** section Create Service From Template *****

  const [
    createServiceFromTemplateInternal,
    {
      loading: loadingCreateServiceFromTemplate,
      error: errorCreateServiceFromTemplate,
    },
  ] = useMutation<TCreateServiceFromTemplate>(CREATE_SERVICE_FROM_TEMPLATE, {});

  const createServiceFromTemplate = (
    data: models.ResourceFromTemplateCreateInput
  ) => {
    return new Promise<models.Resource>((resolve, reject) => {
      createServiceFromTemplateInternal({ variables: { data: data } })
        .then((result) => {
          if (result.data?.createResourceFromTemplate.id) {
            reloadResources().then(() => {
              resourceRedirect(
                result.data.createResourceFromTemplate.id as string
              );
              addBlock(result.data.createResourceFromTemplate.id);
              resolve(result.data?.createResourceFromTemplate);
            });
          } else {
            resolve(null);
          }
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };
  // ***** end section Create Service From Template *****

  return {
    resources,
    projectConfigurationResource,
    pluginRepositoryResource,
    loadingResources,
    errorResources,
    reloadResources,
    currentResource,
    createService,
    loadingCreateService,
    errorCreateService,
    createMessageBroker,
    loadingCreateMessageBroker,
    errorCreateMessageBroker,
    createPluginRepository,
    loadingCreatePluginRepository,
    errorCreatePluginRepository,
    gitRepositoryFullName,
    gitRepositoryUrl,
    gitRepositoryOrganizationProvider,
    createServiceWithEntitiesResult,
    updateCodeGeneratorVersion,
    loadingUpdateCodeGeneratorVersion,
    errorUpdateCodeGeneratorVersion,
    createServiceFromTemplate,
    loadingCreateServiceFromTemplate,
    errorCreateServiceFromTemplate,
  };
};

export default useResources;
