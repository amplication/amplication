import { useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { match, useHistory, useRouteMatch } from "react-router-dom";
import * as models from "../../models";
import { useTracking } from "../../util/analytics";
import {
  CREATE_RESOURCE_WITH_ENTITIES,
  GET_RESOURCES,
} from "../queries/resourcesQueries";

type TData = {
  resources: models.Resource[];
  createResourceWithEntities: models.Resource;
};

const createGitRepositoryFullName = (
  gitRepository: models.Maybe<models.GitRepository> | undefined
) => {
  return (
    (gitRepository &&
      `${gitRepository.gitOrganization.name}/${gitRepository.name}`) ||
    "connect to GitHub"
  );
};

const useResources = (
  currentWorkspace: models.Workspace | undefined,
  currentProject: models.Project | undefined
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

  const [currentResource, setCurrentResource] = useState<models.Resource>();
  const [resources, setResources] = useState<models.Resource[]>([]);
  const [
    projectConfigurationResource,
    setProjectConfigurationResource,
  ] = useState<models.Resource | undefined>(undefined);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [gitRepositoryFullName, setGitRepositoryFullName] = useState<string>(
    createGitRepositoryFullName(currentResource?.gitRepository)
  );
  const [gitRepositoryUrl, setGitRepositoryUrl] = useState<string>("");

  const {
    data: resourcesData,
    loading: loadingResources,
    error: errorResources,
    refetch,
  } = useQuery<TData>(GET_RESOURCES, {
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
    (resourceId: string) =>
      history.push({
        pathname: `/${currentWorkspace?.id}/${currentProject?.id}/${resourceId}`,
      }),
    [currentWorkspace, history, currentProject]
  );

  const [
    createResourceWithEntities,
    { loading: loadingCreateResource, error: errorCreateResource },
  ] = useMutation<TData>(CREATE_RESOURCE_WITH_ENTITIES);

  const createResource = (
    data: models.ResourceCreateWithEntitiesInput,
    eventName: string,
    addEntity: (id: string) => void
  ) => {
    trackEvent({
      eventName: eventName,
    });
    createResourceWithEntities({ variables: { data: data } }).then((result) => {
      result.data?.createResourceWithEntities.id &&
        addEntity(result.data?.createResourceWithEntities.id);
      result.data?.createResourceWithEntities.id &&
        refetch().then(() =>
          resourceRedirect(result.data?.createResourceWithEntities.id as string)
        );
    });
  };

  useEffect(() => {
    if (resourceMatch) return;

    currentResource && setCurrentResource(undefined);
    projectConfigurationResource &&
      setGitRepositoryFullName(
        createGitRepositoryFullName(projectConfigurationResource.gitRepository)
      );
    setGitRepositoryUrl(`https://github.com/${gitRepositoryFullName}`);
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
    setGitRepositoryUrl(`https://github.com/${gitRepositoryFullName}`);
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
        eventName: "resourceCardClick",
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
    createResource,
    loadingCreateResource,
    errorCreateResource,
    gitRepositoryFullName,
    gitRepositoryUrl,
  };
};

export default useResources;
