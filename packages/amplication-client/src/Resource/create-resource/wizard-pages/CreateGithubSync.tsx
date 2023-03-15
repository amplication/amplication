import React, { useCallback, useContext } from "react";
import { AppContext } from "../../../context/appContext";
import AuthWithGit from "../../git/AuthWithGit";
import "./CreateGithubSync.scss";
import { CreateServiceWizardLayout as Layout } from "../CreateServiceWizardLayout";
import { gitRepositorySelected } from "../../git/dialogs/GitRepos/GithubRepos";
import { WizardStepProps } from "./interfaces";
import { CreateGitRepositoryInput } from "@amplication/code-gen-types/models";

const className = "create-github-sync";

const CreateGithubSync: React.FC<WizardStepProps> = ({
  moduleClass,
  formik,
}) => {
  const { refreshCurrentWorkspace } = useContext(AppContext);

  const handleOnDone = useCallback(() => {
    //refreshCurrentWorkspace();
  }, []);

  const handleOnGitRepositorySelected = useCallback(
    (data: gitRepositorySelected) => {
      formik.setValues([
        { gitRepositoryName: data.repositoryName },
        { gitOrganizationId: data.gitOrganizationId },
      ]);

      refreshCurrentWorkspace();
    },
    [refreshCurrentWorkspace]
  );

  const handleOnGitRepositoryCreated = useCallback(
    (data: CreateGitRepositoryInput) => {
      formik.setValues([
        { gitRepositoryName: data.name },
        { gitOrganizationId: data.gitOrganizationId },
      ]);

      refreshCurrentWorkspace();
    },
    [refreshCurrentWorkspace]
  );

  return (
    <Layout.Split>
      <Layout.LeftSide>
        <Layout.Description
          header="Now, let`s connect to a Git repository"
          text="Amplication automatically pushes the generated code of your services to a git repository. You are the owner of the code and can freely customize it."
        />
      </Layout.LeftSide>
      <Layout.RightSide>
        <div className={`${className}__github_box`}>
          <AuthWithGit
            onDone={handleOnDone}
            onGitRepositorySelected={handleOnGitRepositorySelected}
            onGitRepositoryCreated={handleOnGitRepositoryCreated}
          ></AuthWithGit>
        </div>
      </Layout.RightSide>
    </Layout.Split>
  );
};

export default CreateGithubSync;
