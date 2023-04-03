import React, { useCallback, useContext, useEffect, useMemo } from "react";
import { AppContext } from "../../../context/appContext";
import AuthWithGit from "../../git/AuthWithGit";
import "./CreateGithubSync.scss";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "../../git/dialogs/GitRepos/GithubRepos";
import { WizardStepProps } from "./interfaces";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";
import { DefineUser } from "../CreateServiceWizard";
import ServiceWizardConfigurationGitSettings from "../../git/ServiceWizardConfigurationGitSettings";

const className = "create-github-sync";

type props = {
  defineUser: DefineUser;
} & WizardStepProps;

const CreateGithubSync: React.FC<props> = ({
  moduleClass,
  formik,
  defineUser,
  trackWizardPageEvent,
}) => {
  const { refreshCurrentWorkspace, currentProjectConfiguration } =
    useContext(AppContext);

  const { gitRepository } = currentProjectConfiguration;

  const projectConfigGitRepository = {
    gitOrganizationId: gitRepository?.gitOrganizationId,
    repositoryName: gitRepository?.name,
    gitRepositoryUrl: `https://github.com/${gitRepository?.name}`,
  };

  useEffect(() => {
    trackWizardPageEvent(AnalyticsEventNames.ViewServiceWizardStep_Git);
    formik.validateForm();
  }, []);

  useEffect(() => {
    if (formik.values.gitOrganizationId) return;
    formik.setValues(
      {
        ...formik.values,
        gitRepositoryName: projectConfigGitRepository?.repositoryName,
        gitOrganizationId: projectConfigGitRepository?.gitOrganizationId,
        gitRepositoryUrl: projectConfigGitRepository?.gitRepositoryUrl,
      },
      true
    );
  }, [gitRepository]);

  const handleOnDone = useCallback(() => {
    refreshCurrentWorkspace();
  }, [refreshCurrentWorkspace]);

  const handleOnGitRepositorySelected = useCallback(
    (data: GitRepositorySelected) => {
      formik.setValues(
        {
          ...formik.values,
          gitRepositoryName: data.repositoryName,
          gitOrganizationId: data.gitOrganizationId,
          gitRepositoryUrl: data.gitRepositoryUrl,
        },
        true
      );
      refreshCurrentWorkspace();
    },
    [refreshCurrentWorkspace, formik]
  );

  const handleOnGitRepositoryCreated = useCallback(
    (data: GitRepositoryCreatedData) => {
      formik.setValues(
        {
          ...formik.values,
          gitRepositoryName: data.name,
          gitOrganizationId: data.gitOrganizationId,
          gitRepositoryUrl: data.gitRepositoryUrl,
        },
        true
      );
      refreshCurrentWorkspace();
    },
    [refreshCurrentWorkspace, formik]
  );

  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.DescriptionCustom
          header="Now, let`s connect to a Git repository"
          text={
            <div className={`create-service-wizard-layout__description__text`}>
              Amplication automatically pushes the generated code of your
              services to a git repository.
              <br />
              You are the owner of the code and can freely customize it.
            </div>
          }
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <div className={`${className}__github_box`}>
          {defineUser === "Onboarding" ? (
            <AuthWithGit
              onDone={handleOnDone}
              onGitRepositorySelected={handleOnGitRepositorySelected}
              onGitRepositoryCreated={handleOnGitRepositoryCreated}
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
              }}
            ></AuthWithGit>
          ) : (
            <ServiceWizardConfigurationGitSettings
              onDone={handleOnDone}
              formik={formik}
              onGitRepositorySelected={handleOnGitRepositorySelected}
              onGitRepositoryCreated={handleOnGitRepositoryCreated}
            ></ServiceWizardConfigurationGitSettings>
          )}
        </div>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateGithubSync;
