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
import { getGitRepositoryUrlForServiceWizard } from "../../util/get-git-repository-url-for-service-wizard";

type TGetResources = {
  resources: models.Resource[];
};

type TCreateService = {
  createServiceWithEntities: models.ResourceCreateWithEntitiesResult;
};

type TCreateMessageBroker = {
  createMessageBroker: models.Resource;
};

const createGitRepositoryFullName = (
  gitRepository: models.Maybe<models.GitRepository> | undefined
) => {
  return (
    (gitRepository &&
      gitRepository?.gitOrganization &&
      `${gitRepository.gitOrganization?.name}/${gitRepository?.name}`) ||
    "connect to GitHub"
  );
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
    createGitRepositoryFullName(currentResource?.gitRepository)
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
    refetch,
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
  ] = useMutation<TCreateService>(CREATE_SERVICE_WITH_ENTITIES);

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
      refetch();
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
        refetch().then(() => {
          resourceRedirect(result.data?.createMessageBroker.id as string);
        });
    });
  };

  useEffect(() => {
    if (resourceMatch || createResourceMatch) return;

    currentResource && setCurrentResource(undefined);
    projectConfigurationResource &&
      setGitRepositoryFullName(
        createGitRepositoryFullName(projectConfigurationResource.gitRepository)
      );
    setGitRepositoryUrl(
      getGitRepositoryUrlForServiceWizard(
        projectConfigurationResource?.gitRepository?.gitOrganization?.provider,
        createGitRepositoryFullName(projectConfigurationResource.gitRepository)
      )
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
      createGitRepositoryFullName(resource?.gitRepository)
    );
    setGitRepositoryUrl(
      getGitRepositoryUrlForServiceWizard(
        resource?.gitRepository?.gitOrganization?.provider,
        createGitRepositoryFullName(resource?.gitRepository)
      )
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
  };
};

export default useResources;
