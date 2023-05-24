import React, { useCallback, useContext, useEffect } from "react";
import { AppContext } from "../../../context/appContext";
import AuthWithGit from "../../git/AuthWithGit";
import "./CreateGithubSync.scss";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "../../git/dialogs/GitRepos/GithubRepos";
import { WizardStepProps } from "./interfaces";
import { DefineUser } from "../CreateServiceWizard";
import ServiceWizardConfigurationGitSettings from "../../git/ServiceWizardConfigurationGitSettings";
import { getGitRepositoryDetails } from "../../../util/git-repository-details";

const className = "create-git-sync";

type props = {
  defineUser: DefineUser;
} & WizardStepProps;

const CreateGithubSync: React.FC<props> = ({
  moduleClass,
  formik,
  defineUser,
}) => {
  const { refreshCurrentWorkspace, currentProjectConfiguration, resources } =
    useContext(AppContext);

  const { gitRepository } = currentProjectConfiguration;
  const gitProvider = gitRepository?.gitOrganization?.provider;
  const gitRepositoryUrl = getGitRepositoryDetails({
    organization: gitRepository?.gitOrganization,
    repositoryName: gitRepository?.name,
    groupName: gitRepository?.groupName,
  }).repositoryUrl;
  const projectConfigGitRepository = {
    gitOrganizationId: gitRepository?.gitOrganizationId,
    repositoryName: gitRepository?.name,
    gitRepositoryUrl: gitRepositoryUrl,
    gitProvider: gitProvider,
    groupName: gitRepository?.groupName,
  };

  const isNeedToConnectGitProvider = resources.length === 0 && !gitRepository;

  useEffect(() => {
    formik.validateForm();
  }, []);

  useEffect(() => {
    if (formik.values.gitOrganizationId && formik.values.groupName) return;

    formik.setValues(
      {
        ...formik.values,
        gitRepositoryName: projectConfigGitRepository?.repositoryName,
        gitOrganizationId: projectConfigGitRepository?.gitOrganizationId,
        gitRepositoryUrl: projectConfigGitRepository?.gitRepositoryUrl,
        gitProvider: projectConfigGitRepository?.gitProvider,
        groupName: projectConfigGitRepository?.groupName,
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
          gitProvider: data.gitProvider,
          groupName: data.groupName,
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
          gitProvider: data.gitProvider,
          groupName: data.groupName,
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
          header="Now, let's connect to a Git repository"
          text={
            <div className={`create-service-wizard-layout__description__text`}>
              Amplication automatically pushes the generated code of your
              services to a Git repository.
              <br />
              You are the owner of the code and can freely customize it.
            </div>
          }
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <div className={`${className}__github_box`}>
          {defineUser === "Onboarding" || isNeedToConnectGitProvider ? (
            <AuthWithGit
              gitProvider={gitProvider}
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
                    groupName: null,
                  },
                  true
                );
              }}
              gitRepositorySelected={{
                gitOrganizationId: formik.values.gitOrganizationId,
                repositoryName: formik.values.gitRepositoryName,
                gitRepositoryUrl: formik.values.gitRepositoryUrl,
                gitProvider: formik.values.gitProvider,
                groupName: formik.values.groupName,
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
