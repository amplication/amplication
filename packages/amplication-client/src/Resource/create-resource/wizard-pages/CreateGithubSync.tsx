import React, { useCallback, useContext, useEffect } from "react";
import { AppContext } from "../../../context/appContext";
import "./CreateGithubSync.scss";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import {
  GitRepositoryCreatedData,
  GitRepositorySelected,
} from "../../git/dialogs/GitRepos/GithubRepos";
import { WizardStepProps } from "./interfaces";
import { WizardFlowType } from "../types";
import ResourceGitSettingsWithOverrideWizard from "../../git/ResourceGitSettingsWithOverrideWizard";
import { getGitRepositoryDetails } from "../../../util/git-repository-details";
import { Icon, ToggleField, Tooltip } from "@amplication/ui/design-system";
import ResourceGitSettings from "../../git/ResourceGitSettings";

const TOOLTIP_DIRECTION = "n";
const CLASS_NAME = "create-git-sync";
const DEMO_REPO_TOOLTIP =
  "Take Amplication for a test drive with a preview repository on our GitHub account. You can later connect to your own repository.";

type props = {
  wizardFlowType: WizardFlowType;
} & WizardStepProps;

const CreateGithubSync: React.FC<props> = ({
  moduleClass,
  formik,
  wizardFlowType,
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

  const handleOnDone = useCallback(() => {
    refreshCurrentWorkspace();
  }, [refreshCurrentWorkspace]);

  const handleOnGitRepositorySelected = useCallback(
    (data: GitRepositorySelected) => {
      formik.setValues(
        {
          ...formik.values,
          connectToDemoRepo: false,
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
          connectToDemoRepo: false,
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

  const handleRepositoryDisconnected = useCallback(() => {
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
  }, [formik]);

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
          {wizardFlowType === "Onboarding" || isNeedToConnectGitProvider ? (
            <ResourceGitSettings
              type="wizard"
              gitProvider={gitProvider}
              onDone={handleOnDone}
              gitRepositoryDisconnectedCb={handleRepositoryDisconnected}
              gitRepositoryCreatedCb={handleOnGitRepositoryCreated}
              gitRepositorySelectedCb={handleOnGitRepositorySelected}
              gitRepositorySelected={{
                gitOrganizationId: formik.values.gitOrganizationId,
                repositoryName: formik.values.gitRepositoryName,
                gitRepositoryUrl: formik.values.gitRepositoryUrl,
                gitProvider: formik.values.gitProvider,
                groupName: formik.values.groupName,
              }}
            />
          ) : (
            <ResourceGitSettingsWithOverrideWizard
              onDone={handleOnDone}
              formik={formik}
              gitRepositoryDisconnectedCb={handleRepositoryDisconnected}
              gitRepositoryCreatedCb={handleOnGitRepositoryCreated}
              gitRepositorySelectedCb={handleOnGitRepositorySelected}
            />
          )}

          {wizardFlowType === "Onboarding" && (
            <div className={`${CLASS_NAME}__demo`}>
              <Tooltip
                wrap
                direction={TOOLTIP_DIRECTION}
                aria-label={DEMO_REPO_TOOLTIP}
                className={`${CLASS_NAME}__demo__tooltip`}
              >
                <Icon icon="info_circle" size="small" />
              </Tooltip>

              <ToggleField
                disabled={formik.values.gitRepositoryName}
                name="connectToDemoRepo"
                label="Push the generated code to a preview repository on GitHub"
              />
            </div>
          )}
        </Layout.ContentWrapper>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateGithubSync;
