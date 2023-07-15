import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import { GitOrganizationFromGitRepository } from "./SyncWithGithubPage";
import { GitOrganization, Resource } from "../../models";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "./dialogs/GitRepos/GithubRepos";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { ApolloError, useMutation } from "@apollo/client";
import {
  CONNECT_GIT_PROVIDER_REPOSITORY,
  UPDATE_GIT_REPOSITORY,
} from "./queries/gitProvider";
import * as models from "../../models";

type UpdateGitRepositoryData = {
  updateGitRepository: models.GitRepository;
};

type UseGitHook = (obj: {
  resource: Resource;
  gitRepositorySelected?: GitRepositorySelected;
  gitRepositoryDisconnectedCb?: () => void;
  gitRepositoryCreatedCb: (data: GitRepositoryCreatedData) => void;
  gitRepositorySelectedCb?: (data: GitRepositorySelected) => void;
}) => {
  gitOrganizations: GitOrganization[];
  gitOrganization: GitOrganizationFromGitRepository;
  gitRepositorySelectedData: GitRepositorySelected;
  isSelectOrganizationDialogOpen: boolean;
  createNewRepoOpen: boolean;
  selectRepoOpen: boolean;
  popupFailed: boolean;
  setPopupFailed: React.Dispatch<React.SetStateAction<boolean>>;
  connectGitRepoLoading: boolean;
  connectGitRepoError: ApolloError;
  handleRepoSelected: (data: GitRepositorySelected) => void;
  handleRepoCreated: (data: GitRepositoryCreatedData) => void;
  handleOrganizationChange: (
    organization: GitOrganizationFromGitRepository
  ) => void;
  handleRepoDisconnected: () => void;
  openSelectOrganizationDialog: () => void;
  closeSelectOrganizationDialog: () => void;
  openSelectRepoDialog: () => void;
  closeSelectRepoDialog: () => void;
  openCreateNewRepo: () => void;
  closeCreateNewRepo: () => void;
  updateGitRepository: (
    gitRepositoryId: string,
    data: models.GitRepositoryUpdateInput
  ) => void;
  updateGitRepositoryError: ApolloError;
  updateGitRepositoryLoading: boolean;
};

interface setGitOrganizationCompose {
  resource: Resource;
  gitOrganizations: GitOrganization[];
  gitRepositorySelectedData: GitRepositorySelected;
  gitOrganization: GitOrganization;
}

const useGitHook: UseGitHook = ({
  resource,
  gitRepositorySelected,
  gitRepositoryDisconnectedCb,
  gitRepositoryCreatedCb,
  gitRepositorySelectedCb,
}) => {
  const { currentWorkspace } = useContext(AppContext);
  const { trackEvent } = useTracking();
  const gitOrganizations = currentWorkspace?.gitOrganizations;
  const [gitOrganization, setGitOrganization] =
    useState<GitOrganizationFromGitRepository | null>(null);
  const [selectRepoOpen, setSelectRepoOpen] = useState<boolean>(false);
  const [createNewRepoOpen, setCreateNewRepoOpen] = useState<boolean>(false);
  const [popupFailed, setPopupFailed] = useState(false);
  const [isSelectOrganizationDialogOpen, setSelectOrganizationDialogOpen] =
    useState(false);
  const [gitRepositorySelectedData, setGitRepositorySelectedData] =
    useState<GitRepositorySelected>(gitRepositorySelected || null);
  const [
    connectGitRepository,
    { loading: connectGitRepoLoading, error: connectGitRepoError },
  ] = useMutation<Resource>(CONNECT_GIT_PROVIDER_REPOSITORY);

  useEffect(() => {
    const getGitOrganization = compose(
      gitOrganizationFromResource,
      gitOrganizationFromSelectedData,
      gitOrganizationFromOrganizations
    )({
      resource,
      gitOrganizations,
      gitRepositorySelectedData,
      gitOrganization,
    });

    getGitOrganization.gitOrganization &&
      setGitOrganization(getGitOrganization.gitOrganization);
  }, [resource, gitOrganizations, gitRepositorySelectedData]);

  useEffect(() => {
    if (!gitRepositorySelected?.gitOrganizationId) return;

    setGitRepositorySelectedData(gitRepositorySelected);
  }, [gitRepositorySelected?.gitOrganizationId]);

  const [
    updateGitRepositoryMutation,
    { error: updateGitRepositoryError, loading: updateGitRepositoryLoading },
  ] = useMutation<UpdateGitRepositoryData>(UPDATE_GIT_REPOSITORY, {
    onCompleted: (data) => {
      //update the state - but it uses some unique type so need to convert first
    },
  });

  const updateGitRepository = useCallback(
    (gitRepositoryId: string, data: models.GitRepositoryUpdateInput) => {
      updateGitRepositoryMutation({
        variables: {
          where: { id: gitRepositoryId },
          data,
        },
      }).catch(console.error);
    },
    [updateGitRepositoryMutation]
  );

  const handleRepoSelected = useCallback(
    (data: GitRepositorySelected) => {
      gitRepositorySelectedCb(data);
      gitRepositorySelected && setSelectRepoOpen(false);
      gitRepositorySelected && setGitRepositorySelectedData(data);
      trackEvent({
        eventName: AnalyticsEventNames.GitHubRepositorySync,
      });
    },
    [setSelectRepoOpen, setGitRepositorySelectedData]
  );

  const handleRepoCreated = useCallback(
    (data: GitRepositoryCreatedData) => {
      connectGitRepository({
        variables: {
          name: data.name,
          gitOrganizationId: gitOrganization.id,
          gitProvider: gitOrganization.provider,
          groupName: data.groupName,
          isPublic: data.isPublic,
          ...(resource ? { resourceId: resource.id } : {}),
        },
        onCompleted() {
          closeCreateNewRepo();
          gitRepositoryCreatedCb && gitRepositoryCreatedCb(data);
          gitRepositorySelected &&
            setGitRepositorySelectedData({
              gitOrganizationId: data.gitOrganizationId,
              repositoryName: data.name,
              groupName: data.groupName,
              gitRepositoryUrl: data.gitRepositoryUrl,
              gitProvider: gitOrganization.provider,
            });
        },
      }).catch((error) => {});
      trackEvent({
        eventName: AnalyticsEventNames.GitHubRepositoryCreate,
      });
    },
    [
      gitRepositoryCreatedCb,
      gitRepositorySelected,
      setGitRepositorySelectedData,
      setCreateNewRepoOpen,
      gitOrganization,
    ]
  );

  const handleOrganizationChange = useCallback(
    (organization: GitOrganizationFromGitRepository) => {
      setGitOrganization(organization);
      gitRepositorySelectedData && setGitRepositorySelectedData(null);
      gitRepositoryDisconnectedCb && gitRepositoryDisconnectedCb();
    },
    [
      setGitOrganization,
      gitRepositorySelectedData,
      gitRepositoryDisconnectedCb,
      gitRepositoryDisconnectedCb,
      setGitRepositorySelectedData,
    ]
  );

  const handleRepoDisconnected = useCallback(() => {
    setGitRepositorySelectedData(null);
    gitRepositoryDisconnectedCb && gitRepositoryDisconnectedCb();
  }, [setGitRepositorySelectedData, gitRepositoryDisconnectedCb]);

  const openSelectOrganizationDialog = useCallback(() => {
    setSelectOrganizationDialogOpen(true);
  }, [setSelectOrganizationDialogOpen]);

  const closeSelectOrganizationDialog = useCallback(() => {
    setSelectOrganizationDialogOpen(false);
  }, [setSelectOrganizationDialogOpen]);

  const openSelectRepoDialog = useCallback(() => {
    setSelectRepoOpen(true);
  }, [setSelectRepoOpen]);

  const closeSelectRepoDialog = useCallback(() => {
    setSelectRepoOpen(false);
  }, [setSelectRepoOpen]);

  const openCreateNewRepo = useCallback(() => {
    setCreateNewRepoOpen(true);
  }, [setCreateNewRepoOpen]);

  const closeCreateNewRepo = useCallback(() => {
    setCreateNewRepoOpen(false);
  }, [setCreateNewRepoOpen]);

  return {
    gitOrganizations,
    gitOrganization,
    gitRepositorySelectedData,
    isSelectOrganizationDialogOpen,
    createNewRepoOpen,
    selectRepoOpen,
    popupFailed,
    setPopupFailed,
    connectGitRepoLoading,
    connectGitRepoError,
    handleRepoSelected,
    handleRepoCreated,
    handleOrganizationChange,
    handleRepoDisconnected,
    openSelectOrganizationDialog,
    closeSelectOrganizationDialog,
    openSelectRepoDialog,
    closeSelectRepoDialog,
    openCreateNewRepo,
    closeCreateNewRepo,
    updateGitRepository,
    updateGitRepositoryLoading,
    updateGitRepositoryError,
  };
};

export default useGitHook;

const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((y, f) => f(y), x);

const gitOrganizationFromResource = (obj: setGitOrganizationCompose) => {
  if (!obj.resource?.gitRepository?.gitOrganization) return obj;

  obj.gitOrganization = obj.resource.gitRepository?.gitOrganization;
  return obj;
};

const gitOrganizationFromSelectedData = (obj: setGitOrganizationCompose) => {
  if (
    !obj.gitOrganizations.length ||
    !obj.gitRepositorySelectedData?.gitOrganizationId
  )
    return obj;

  obj.gitOrganization = obj.gitOrganizations.find(
    (organization) =>
      organization.id === obj.gitRepositorySelectedData?.gitOrganizationId
  );
  return obj;
};

const gitOrganizationFromOrganizations = (obj: setGitOrganizationCompose) => {
  if (!obj.gitOrganizations.length) return obj;

  obj.gitOrganization = obj.gitOrganizations[0];
  return obj;
};
