import React, { useCallback, useContext } from "react";
import { AppContext } from "../../../context/appContext";
import AuthWithGit from "../../git/AuthWithGit";
import { FormikProps } from "formik";

import "./CreateGithubSync.scss";

const className = "create-github-sync";

const CreateGithubSync: React.FC<{
  moduleClass: string;
  formik?: FormikProps<{ [key: string]: any }>;
}> = ({ moduleClass }) => {
  const { refreshCurrentWorkspace } = useContext(AppContext);

  const handleOnDone = useCallback(
    (data: any) => {
      // formik.setFieldValue()
      console.log(data);
      refreshCurrentWorkspace();
    },
    [refreshCurrentWorkspace]
  );

  return (
    <div className={className}>
      <div className={`${className}__left`}>
        <div className={`${className}__left__description`}>
          <div className={`${className}__left__description__top`}>
            <h2>Now, let`s connect to a Git repository</h2>
          </div>
          <div className={`${className}__left__description__bottom`}>
            <h3>
              Amplication automatically pushes the generated code of your
              services to a git repository. You are the owner of the code and
              can freely customize it.
            </h3>
          </div>
        </div>
      </div>
      <div className={`${className}__right`}>
        <div className={`${className}__github_box`}>
          {/* <AuthWithGit onDone={handleOnDone}></AuthWithGit> */}
        </div>
      </div>
    </div>
  );
};

export default CreateGithubSync;
