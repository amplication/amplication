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
  CONNECT_GIT_REPOSITORY,
  UPDATE_GIT_REPOSITORY,
} from "./queries/gitProvider";
import * as models from "../../models";

type UpdateGitRepositoryData = {
  updateGitRepository: models.GitRepository;
};

type UseResourceGitSettingsHook = (obj: {
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

const useResourceGitSettings: UseResourceGitSettingsHook = ({
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

  //************************ mutatios ************************
  const [
    connectGitRepository,
    { loading: connectGitRepoLoading, error: connectGitRepoError },
  ] = useMutation<Resource>(CONNECT_GIT_PROVIDER_REPOSITORY);

  const [
    updateGitRepositoryMutation,
    { error: updateGitRepositoryError, loading: updateGitRepositoryLoading },
  ] = useMutation<UpdateGitRepositoryData>(UPDATE_GIT_REPOSITORY, {
    onCompleted: (data) => {
      //update the state - but it uses some unique type so need to convert first
    },
  });

  const [connectSelectGitRepository] = useMutation(CONNECT_GIT_REPOSITORY);
  //************************ mutatios ************************

  const closeSelectRepoDialog = useCallback(() => {
    setSelectRepoOpen(false);
  }, [setSelectRepoOpen]);

  //set the state of the gitOrganization based on this order:
  //1. resource
  //2. gitRepositorySelectedData
  //3. first gitOrganization in the list
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

    //gitOrganization is not included because it will cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, gitOrganizations, gitRepositorySelectedData]);

  //save the selected gitRepository provided by the parent component to the state
  useEffect(() => {
    if (!gitRepositorySelected?.gitOrganizationId) return;

    setGitRepositorySelectedData(gitRepositorySelected);
  }, [gitRepositorySelected?.gitOrganizationId]);

  //calls the mutation to update base branch name
  const updateGitRepository = useCallback(
    (gitRepositoryId: string, data: models.GitRepositoryUpdateInput) => {
      if (data.baseBranchName) {
        trackEvent({
          eventName: AnalyticsEventNames.GitProviderCustomBaseBranch,
          eventOriginLocation: "git-provider-settings",
        });
      }

      updateGitRepositoryMutation({
        variables: {
          where: { id: gitRepositoryId },
          data,
        },
      }).catch(console.error);
    },
    [trackEvent, updateGitRepositoryMutation]
  );

  //internal function that is called from handleRepoSelected
  const handleAfterRepoConnected = useCallback(
    (data: GitRepositorySelected) => {
      closeSelectRepoDialog();
      gitRepositorySelectedCb(data);
      gitRepositorySelected && setSelectRepoOpen(false);
      gitRepositorySelected && setGitRepositorySelectedData(data);
      trackEvent({
        eventName: AnalyticsEventNames.GitHubRepositorySync,
        eventOriginLocation: "git-provider-settings",
      });
    },
    [
      closeSelectRepoDialog,
      gitRepositorySelected,
      gitRepositorySelectedCb,
      trackEvent,
    ]
  );

  //event to be called after a repo is selected in the "select repository" dialog
  //when used from the wizard - the mutation is not triggered and we only call the handleAfterRepoConnected
  const handleRepoSelected = useCallback(
    (data: GitRepositorySelected) => {
      if (data.srcType !== "serviceWizard") {
        connectSelectGitRepository({
          variables: {
            name: data.repositoryName,
            gitOrganizationId: data.gitOrganizationId,
            resourceId: resource?.id,
            groupName: data.groupName,
          },

          onCompleted() {
            handleAfterRepoConnected(data);
          },
        }).catch(console.error);
      } else {
        handleAfterRepoConnected(data);
      }
    },
    [connectSelectGitRepository, resource?.id, handleAfterRepoConnected]
  );

  const closeCreateNewRepo = useCallback(() => {
    setCreateNewRepoOpen(false);
  }, [setCreateNewRepoOpen]);

  //calls the server to create a new repository - with or without connecting to the resource
  //after the repository is created - we close the dialog and call the gitRepositoryCreatedCb
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
        eventOriginLocation: "git-provider-settings",
      });
    },
    [
      connectGitRepository,
      gitOrganization,
      resource,
      trackEvent,
      closeCreateNewRepo,
      gitRepositoryCreatedCb,
      gitRepositorySelected,
    ]
  );

  //sets the selected organization and resets the selected repository
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

  const openCreateNewRepo = useCallback(() => {
    setCreateNewRepoOpen(true);
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

export default useResourceGitSettings;

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
