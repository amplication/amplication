import {
  ConfirmationDialog,
  HorizontalRule,
  LimitationDialog,
  Snackbar,
} from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import React, { useCallback, useContext, useMemo, useState } from "react";
import PageContent from "../../Layout/PageContent";
import { AppContext } from "../../context/appContext";
import {
  EnumCommitStrategy,
  EnumGitOrganizationType,
  EnumGitProvider,
  EnumResourceType,
  EnumResourceTypeGroup,
  EnumSubscriptionPlan,
  Resource,
} from "../../models";
import { formatError } from "../../util/error";
import ResourceGitSettings from "./ResourceGitSettings";
import ResourceGitSettingsWithOverride from "./ResourceGitSettingsWithOverride";
import useCommits from "../../VersionControl/hooks/useCommits";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { useTracking } from "../../util/analytics";
import { useHistory } from "react-router-dom";

const TITLE = "Sync with Git Provider";
const SUB_TITLE =
  "Enable sync with Git provider to automatically push the generated code of your application and create a Pull Request in your Git provider repository every time you commit your changes.";

export type GitOrganizationFromGitRepository = {
  id: string;
  name: string;
  type: EnumGitOrganizationType;
  provider: EnumGitProvider;
  useGroupingForRepositories: boolean;
};

const ResourceGitSettingsPage: React.FC = () => {
  const {
    currentProjectConfiguration,
    currentWorkspace,
    currentResource,
    currentProject,
    refreshCurrentWorkspace,
  } = useContext(AppContext);

  const { trackEvent } = useTracking();
  const history = useHistory();

  const [isOpenLimitationDialog, setOpenLimitationDialog] = useState(false);

  const { commitChanges, commitChangesError, commitChangesLimitationError } =
    useCommits(currentProject?.id);

  const redirectToPurchase = () => {
    const path = `/${currentWorkspace?.id}/purchase`;
    history.push(path, { from: { pathname: history.location.pathname } });
  };

  const bypassLimitations = useMemo(() => {
    return (
      currentWorkspace?.subscription?.subscriptionPlan !==
      EnumSubscriptionPlan.Pro
    );
  }, [currentWorkspace]);

  const resourceId = currentResource
    ? currentResource.id
    : currentProjectConfiguration?.id;

  const { data, error, refetch } = useQuery<{
    resource: Resource;
  }>(GET_RESOURCE_GIT_REPOSITORY, {
    variables: {
      resourceId: resourceId,
    },
    skip: !resourceId,
  });

  const [openPr, setOpenPr] = useState<boolean>(false);
  const isLimitationError = commitChangesLimitationError !== undefined ?? false;

  const handleRepositorySelected = useCallback(() => {
    refreshCurrentWorkspace();
    refetch();
    setOpenPr(true);
  }, [refreshCurrentWorkspace, refetch]);

  const handleCommit = useCallback(() => {
    commitChanges({
      message: "",
      project: { connect: { id: currentProject?.id } },
      bypassLimitations: false,
      resourceTypeGroup: EnumResourceTypeGroup.Services, //because we push to git, this will always be services
      commitStrategy: EnumCommitStrategy.AllWithPendingChanges,
    });
    setOpenPr(false);
  }, [commitChanges, currentProject]);

  const pageTitle = "Sync with Git Provider";
  const errorMessage = formatError(error);
  const isProjectConfiguration =
    data?.resource.resourceType === EnumResourceType.ProjectConfiguration;

  return (
    <PageContent
      pageTitle={pageTitle}
      contentTitle={TITLE}
      contentSubTitle={SUB_TITLE}
    >
      <HorizontalRule />
      {data?.resource && isProjectConfiguration && (
        <ResourceGitSettings
          type="resource"
          resource={data.resource}
          gitRepositorySelectedCb={handleRepositorySelected}
          gitRepositoryCreatedCb={handleRepositorySelected}
        />
      )}
      {!isProjectConfiguration && data?.resource && (
        <ResourceGitSettingsWithOverride
          resource={data.resource}
          gitRepositorySelectedCb={handleRepositorySelected}
          gitRepositoryCreatedCb={handleRepositorySelected}
        />
      )}
      <ConfirmationDialog
        isOpen={openPr}
        confirmButton={{ label: "Yes" }}
        dismissButton={{ label: "Later" }}
        message={
          <span>
            Successfully connected to your Git repository.
            <br />
            Do you want to regenerate the code and push it to this repository?
          </span>
        }
        onConfirm={handleCommit}
        onDismiss={() => setOpenPr(false)}
      />
      {commitChangesError && isLimitationError ? (
        <LimitationDialog
          isOpen={isOpenLimitationDialog}
          message={commitChangesLimitationError.message}
          allowBypassLimitation={bypassLimitations}
          onConfirm={() => {
            redirectToPurchase();
            trackEvent({
              eventName: AnalyticsEventNames.UpgradeClick,
              reason: commitChangesLimitationError.message,
              eventOriginLocation: "commit-limitation-dialog",
              billingFeature: commitChangesLimitationError.billingFeature,
            });
            setOpenLimitationDialog(false);
          }}
          onDismiss={() => {
            trackEvent({
              eventName: AnalyticsEventNames.PassedLimitsNotificationClose,
              reason: commitChangesLimitationError.message,
              eventOriginLocation: "commit-limitation-dialog",
            });
            setOpenLimitationDialog(false);
          }}
          onBypass={() => {
            trackEvent({
              eventName: AnalyticsEventNames.UpgradeLaterClick,
              reason: commitChangesLimitationError.message,
              eventOriginLocation: "commit-limitation-dialog",
              billingFeature: commitChangesLimitationError.billingFeature,
            });
            setOpenLimitationDialog(false);
          }}
        />
      ) : (
        <Snackbar open={Boolean(commitChangesError)} message={errorMessage} />
      )}

      <Snackbar open={Boolean(error)} message={errorMessage} />
    </PageContent>
  );
};

export default ResourceGitSettingsPage;

export const GET_RESOURCE_GIT_REPOSITORY = gql`
  query getResourceGitRepository($resourceId: String!) {
    resource(where: { id: $resourceId }) {
      id
      name
      githubLastSync
      resourceType
      gitRepositoryOverride
      createdAt
      gitRepository {
        id
        name
        groupName
        baseBranchName
        gitOrganization {
          id
          name
          type
          provider
          useGroupingForRepositories
        }
      }
    }
  }
`;
