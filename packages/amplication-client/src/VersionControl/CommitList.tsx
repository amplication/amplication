import React, { useContext } from "react";
import { ApolloError } from "@apollo/client";
import { formatError } from "../util/error";
import * as models from "../models";
import {
  Snackbar,
  CircularProgress,
  EnumButtonStyle,
  Button,
} from "@amplication/ui/design-system";
import { AppContext } from "../context/appContext";
import { CommitListItem } from "./CommitListItem";

type Props = {
  commits: models.Commit[];
  error: ApolloError | undefined;
  loading: boolean;
  onLoadMoreClick: () => void;
  disableLoadMore: boolean;
};

const CommitList = ({
  commits,
  error,
  loading,
  onLoadMoreClick,
  disableLoadMore,
}: Props) => {
  const { currentProject } = useContext(AppContext);

  const errorMessage = formatError(error);

  return (
    <>
      {loading && commits.length === 0 && <CircularProgress centerToParent />}
      {currentProject &&
        commits.map((commit) => (
          <CommitListItem
            key={commit.id}
            commit={commit}
            projectId={currentProject.id}
          />
        ))}

      {!disableLoadMore && (
        <Button buttonStyle={EnumButtonStyle.Text} onClick={onLoadMoreClick}>
          Load more...
        </Button>
      )}
      <Snackbar open={Boolean(error)} message={errorMessage} />
    </>
  );
};

export default CommitList;
