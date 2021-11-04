import { TextField } from "@amplication/design-system";
import { NetworkStatus } from "@apollo/client";
import { CircularProgress } from "@rmwc/circular-progress";
import { Snackbar } from "@rmwc/snackbar";
import { Form, Formik } from "formik";
import React, { useCallback } from "react";
import { Button, EnumButtonStyle } from "../../../../Components/Button";
import { EnumSourceControlService, RepoCreateInput } from "../../../../models";
import { formatError } from "../../../../util/error";
import GitRepoItem from "./GitRepoItem/GitRepoItem";
import "./GitRepos.scss";
import useGetReposOfUser from "../../hooks/useGetReposOfUser";
import useGitCreate from "../../hooks/useGitCreate";
import useGitSelected from "../../hooks/useGitSelected";

const CLASS_NAME = "git-repos";

type Props = {
  applicationId: string;
  onCompleted: () => void;
  sourceControlService: EnumSourceControlService;
};

function GitRepos({ applicationId, onCompleted, sourceControlService }: Props) {
  const {
    refetch,
    error,
    repos,
    loading: loadingRepos,
    networkStatus,
  } = useGetReposOfUser({
    appId: applicationId,
    sourceControlService,
  });
  const { handleCreation } = useGitCreate({
    appId: applicationId,
    sourceControlService: sourceControlService,
    cb: (repo) => {
      handleRepoSelected(repo);
    },
  });

  const { handleRepoSelected, error: errorUpdate } = useGitSelected({
    appId: applicationId,
    onCompleted,
  });

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const errorMessage = formatError(error || errorUpdate);
  const initialValues: RepoCreateInput = { name: "", public: false };

  return (
    <div className={CLASS_NAME}>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          handleCreation(values);
        }}
      >
        {({ values, touched, setTouched, setValues }) => (
          <Form>
            <div className={`${CLASS_NAME}__header`}>
              <h4>
                Select a {sourceControlService} repository to sync your
                application with.
              </h4>
              {(loadingRepos || networkStatus === NetworkStatus.refetch) && (
                <CircularProgress />
              )}
              <Button
                buttonStyle={EnumButtonStyle.Clear}
                onClick={(e) => {
                  handleRefresh();
                  setValues(initialValues);
                  setTouched({ public: false });
                }}
                type="button"
                icon="refresh_cw"
                disabled={networkStatus === NetworkStatus.refetch}
              />
            </div>

            {repos && (
              <>
                <TextField
                  name="name"
                  autoComplete="off"
                  type="text"
                  label="Repository name"
                />

                {repos
                  .filter((repo) => {
                    if (repo?.name.includes(values.name) || !values.name) {
                      if (touched.public) {
                        return repo.private === !values.public;
                      }
                      return true;
                    }
                    return false;
                  })
                  .map((repo) => (
                    <GitRepoItem
                      key={repo.fullName}
                      repo={repo}
                      onSelectRepo={handleRepoSelected}
                    />
                  ))}
              </>
            )}
          </Form>
        )}
      </Formik>
      <Snackbar open={Boolean(error || errorUpdate)} message={errorMessage} />
    </div>
  );
}

export default GitRepos;
