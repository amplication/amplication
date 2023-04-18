import { EnumPanelStyle, Panel, Toggle } from "@amplication/ui/design-system";
import React, { useCallback, useContext, useState } from "react";
import "./SyncWithGithubPage.scss";
import "./ServiceConfigurationGitSettings.scss";
import ProjectConfigurationGitSettings from "./ProjectConfigurationGitSettings";
import { AppContext } from "../../context/appContext";
import { useTracking } from "../../util/analytics";
import { AnalyticsEventNames } from "../../util/analytics-events.types";
import AuthWithGit from "./AuthWithGit";
import { FormikProps } from "formik";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "./dialogs/GitRepos/GithubRepos";

const CLASS_NAME = "service-configuration-git-settings";

type Props = {
  onDone: () => void;
  onGitRepositorySelected: (data: GitRepositorySelected) => void;
  onGitRepositoryCreated: (data: GitRepositoryCreatedData) => void;
  //onGitRepositoryDisconnected: () => void;
  formik: FormikProps<{ [key: string]: any }>;
};

const ServiceWizardConfigurationGitSettings: React.FC<Props> = ({
  onDone,
  onGitRepositorySelected,
  onGitRepositoryCreated,
  // onGitRepositoryDisconnected,
  formik,
}) => {
  const {
    currentWorkspace,
    currentProjectConfiguration,
    gitRepositoryUrl,
    gitRepositoryOrganizationProvider,
  } = useContext(AppContext);
  const [isOverride, setIsOverride] = useState<boolean>(
    formik.values.isOverrideGitRepository || false
  );
  const { trackEvent } = useTracking();
  const { gitRepository } = currentProjectConfiguration;
  const settingsClassName = isOverride
    ? "gitSettingsPanel"
    : "gitSettingsFromProject";

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
            gitProvider: gitRepositoryOrganizationProvider,
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

  const isToggleDisable = currentWorkspace?.gitOrganizations?.length === 0;

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__panelWarper`}>
        <ProjectConfigurationGitSettings isOverride={isOverride} />
        <Panel
          className={`${CLASS_NAME}__${settingsClassName}`}
          panelStyle={EnumPanelStyle.Transparent}
        >
          <div className={`${CLASS_NAME}__defaultSettings`}>
            <div>Override default settings</div>

            <div>
              <Toggle
                disabled={isToggleDisable}
                onValueChange={handleToggleChange}
                checked={isOverride}
              />
            </div>
          </div>
          {isOverride && (
            <div className={`${CLASS_NAME}__AuthWithGit`}>
              <hr />
              <AuthWithGit
                onDone={onDone}
                onGitRepositorySelected={onGitRepositorySelected}
                onGitRepositoryCreated={onGitRepositoryCreated}
                onGitRepositoryDisconnected={() => {
                  formik.setValues(
                    {
                      ...formik.values,
                      gitRepositoryName: null,
                      gitOrganizationId: null,
                      gitRepositoryUrl: null,
                    },
                    true
                  );
                }}
                gitRepositorySelected={{
                  gitOrganizationId: formik.values.gitOrganizationId,
                  repositoryName: formik.values.gitRepositoryName,
                  gitRepositoryUrl: formik.values.gitRepositoryUrl,
                  gitProvider: formik.values.gitProvider,
                }}
              />
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
};

export default ServiceWizardConfigurationGitSettings;
