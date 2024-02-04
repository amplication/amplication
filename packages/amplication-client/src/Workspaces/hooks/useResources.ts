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
} from "../queries/resourcesQueries";
import { getGitRepositoryDetails } from "../../util/git-repository-details";
import { GET_PROJECTS } from "../queries/projectQueries";
import { UPDATE_CODE_GENERATOR_VERSION } from "../../Resource/codeGeneratorVersionSettings/queries";

type TGetResources = {
  resources: models.Resource[];
};

type TCreateService = {
  createServiceWithEntities: models.ResourceCreateWithEntitiesResult;
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
  }>(
    "/:workspace([A-Za-z0-9-]{20,})/:project([A-Za-z0-9-]{20,})/:resource([A-Za-z0-9-]{20,})"
  );
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

  const [currentResource, setCurrentResource] = useState<models.Resource>();
  const [createServiceWithEntitiesResult, setCreateServiceWithEntitiesResult] =
    useState<models.ResourceCreateWithEntitiesResult>();

  const [resources, setResources] = useState<models.Resource[]>([]);
  const [projectConfigurationResource, setProjectConfigurationResource] =
    useState<models.Resource | undefined>(undefined);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
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
      projectId: currentProject?.id,
      whereName:
        searchPhrase !== ""
          ? { contains: searchPhrase, mode: models.QueryMode.Insensitive }
          : undefined,
    },
    skip: !currentProject?.id,
  });

  const resourceRedirect = useCallback(
    (resourceId: string) => {
      history.push({
        pathname: `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}`, //todo:change the route
      });
    },
    [currentWorkspace, history, currentProject]
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
    createServiceWithEntities({ variables: { data: data } }).then((result) => {
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
    });
  };

  const [
    createBroker,
    { loading: loadingCreateMessageBroker, error: errorCreateMessageBroker },
  ] = useMutation<TCreateMessageBroker>(CREATE_MESSAGE_BROKER);

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
    resourceMatch,
    resources,
    projectConfigurationResource,
    gitRepositoryFullName,
  ]);

  useEffect(() => {
    if (loadingResources || !resourcesData) return;
    const projectConfigurationResource = resourcesData.resources.find(
      (r) => r.resourceType === models.EnumResourceType.ProjectConfiguration
    );
    setProjectConfigurationResource(projectConfigurationResource);

    const resources = resourcesData.resources.filter(
      (r) => r.resourceType !== models.EnumResourceType.ProjectConfiguration
    );
    setResources(resources);
  }, [resourcesData, loadingResources]);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchPhrase(value);
    },
    [setSearchPhrase]
  );
  const setResource = useCallback(
    (resource: models.Resource) => {
      trackEvent({
        eventName: AnalyticsEventNames.ResourceCardClick,
      });
      setCurrentResource(resource);
      currentWorkspace &&
        currentProject &&
        history.push(
          `/${currentWorkspace.id}/${currentProject.id}/${resource.id}`
        );
    },
    [currentProject, currentWorkspace, history, trackEvent]
  );

  return {
    resources,
    projectConfigurationResource,
    handleSearchChange,
    loadingResources,
    errorResources,
    reloadResources,
    currentResource,
    setResource,
    createService,
    loadingCreateService,
    errorCreateService,
    createMessageBroker,
    loadingCreateMessageBroker,
    errorCreateMessageBroker,
    gitRepositoryFullName,
    gitRepositoryUrl,
    gitRepositoryOrganizationProvider,
    createServiceWithEntitiesResult,
    updateCodeGeneratorVersion,
    loadingUpdateCodeGeneratorVersion,
    errorUpdateCodeGeneratorVersion,
  };
};

export default useResources;
