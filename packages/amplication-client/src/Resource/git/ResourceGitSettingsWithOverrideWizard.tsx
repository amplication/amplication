import {
  EnumItemsAlign,
  EnumPanelStyle,
  FlexItem,
  Panel,
  Toggle,
} from "@amplication/ui/design-system";
import { FormikProps } from "formik";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/appContext";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import { getGitRepositoryDetails } from "../../util/git-repository-details";
import ResourceGitSettings from "./ResourceGitSettings";
import ProjectConfigurationGitSettings from "./ProjectConfigurationGitSettings";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "./dialogs/GitRepos/GithubRepos";

const CLASS_NAME = "service-configuration-git-settings";

type Props = {
  onDone: () => void;
  gitRepositoryDisconnectedCb: () => void;
  gitRepositoryCreatedCb: (data: GitRepositoryCreatedData) => void;
  gitRepositorySelectedCb: (data: GitRepositorySelected) => void;
  formik: FormikProps<{ [key: string]: any }>;
};

const ResourceGitSettingsWithOverrideWizard: React.FC<Props> = ({
  onDone,
  gitRepositoryDisconnectedCb,
  gitRepositoryCreatedCb,
  gitRepositorySelectedCb,
  formik,
}) => {
  const { currentProjectConfiguration, resources } = useContext(AppContext);
  const { gitRepository } = currentProjectConfiguration;
  const [isOverride, setIsOverride] = useState<boolean>(
    formik.values.isOverrideGitRepository ||
      (!gitRepository && resources.length > 0)
  );
  const { trackEvent } = useTracking();
  const gitProvider = gitRepository?.gitOrganization?.provider;

  const gitRepositoryUrl = getGitRepositoryDetails({
    organization: gitRepository?.gitOrganization,
    repositoryName: gitRepository?.name,
    groupName: gitRepository?.groupName,
  }).repositoryUrl;

  useEffect(() => {
    formik.setFieldValue("isOverrideGitRepository", isOverride);
  }, [formik.values]);

  const handleToggleChange = useCallback(
    (gitRepositoryOverride) => {
      setIsOverride(gitRepositoryOverride);
      formik.setFieldValue("isOverrideGitRepository", gitRepositoryOverride);
      if (!gitRepositoryOverride) {
        formik.setValues(
          {
            ...formik.values,
            gitRepositoryName: gitRepository?.name,
            gitOrganizationId: gitRepository?.gitOrganizationId,
            gitRepositoryUrl: gitRepositoryUrl,
            gitProvider: gitProvider,
            isOverrideGitRepository: false,
          },
          true
        );
      } else {
        formik.setValues(
          {
            ...formik.values,
            gitRepositoryName: null,
            gitOrganizationId: null,
            gitRepositoryUrl: null,
            isOverrideGitRepository: true,
          },
          true
        );
      }
      trackEvent({
        eventName: AnalyticsEventNames.ResourceInfoUpdate,
      });
    },
    [trackEvent, formik.values]
  );

  return (
    <div className={CLASS_NAME}>
      <Panel panelStyle={EnumPanelStyle.Surface}>
        <FlexItem itemsAlign={EnumItemsAlign.Center}>
          <Toggle
            label="Override default settings"
            onValueChange={handleToggleChange}
            checked={isOverride}
          />
        </FlexItem>
      </Panel>

      {!isOverride && (
        <ProjectConfigurationGitSettings
          isOverride={isOverride}
          showProjectSettingsLink={false}
        />
      )}

      {isOverride && (
        <ResourceGitSettings
          type="wizard"
          gitProvider={gitProvider}
          onDone={onDone}
          gitRepositoryDisconnectedCb={gitRepositoryDisconnectedCb}
          gitRepositoryCreatedCb={gitRepositoryCreatedCb}
          gitRepositorySelectedCb={gitRepositorySelectedCb}
          gitRepositorySelected={{
            gitOrganizationId: formik.values.gitOrganizationId,
            repositoryName: formik.values.gitRepositoryName,
            gitRepositoryUrl: formik.values.gitRepositoryUrl,
            gitProvider: formik.values.gitProvider,
          }}
        />
      )}
    </div>
  );
};

export default ResourceGitSettingsWithOverrideWizard;
