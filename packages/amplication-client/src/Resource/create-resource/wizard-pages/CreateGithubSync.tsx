import React, { useCallback, useContext, useEffect } from "react";
import { AppContext } from "../../../context/appContext";
import { getGitRepositoryDetails } from "../../../util/git-repository-details";
import { GitRepositoryCreatedData } from "../../git/dialogs/GitRepos/GithubRepos";
import ResourceGitSettingsWithOverrideWizard from "../../git/ResourceGitSettingsWithOverrideWizard";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { WizardFlowType } from "../types";
import "./CreateGithubSync.scss";
import { WizardStepProps } from "./interfaces";

type props = {
  wizardFlowType: WizardFlowType;
} & WizardStepProps;

const CreateGithubSync: React.FC<props> = ({
  moduleClass,
  formik,
  wizardFlowType,
}) => {
  const { refreshCurrentWorkspace, currentProjectConfiguration } =
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

  useEffect(() => {
    formik.validateForm();
  }, []);

  useEffect(() => {
    if (formik.values.gitOrganizationId && formik.values.groupName) return;
    if (formik.values.connectToDemoRepo) return;

    formik.setValues(
      {
        ...formik.values,
        connectToDemoRepo: false,
        gitRepositoryName: projectConfigGitRepository?.repositoryName,
        gitOrganizationId: projectConfigGitRepository?.gitOrganizationId,
        gitRepositoryUrl: projectConfigGitRepository?.gitRepositoryUrl,
        gitProvider: projectConfigGitRepository?.gitProvider,
        groupName: projectConfigGitRepository?.groupName,
      },
      true
    );
  }, [gitRepository]);

  const handleOnGitRepositoryCreated = useCallback(
    (data: GitRepositoryCreatedData) => {
      refreshCurrentWorkspace();
    },
    [refreshCurrentWorkspace]
  );

  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header="Now, let's connect to a Git repository"
          text={
            "Amplication automatically pushes the generated code of your services to a Git repository. You are the owner of the code and can freely customize it."
          }
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <Layout.ContentWrapper>
          <ResourceGitSettingsWithOverrideWizard
            formik={formik}
            gitRepositoryCreatedCb={handleOnGitRepositoryCreated}
          />
        </Layout.ContentWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateGithubSync;
