import React from "react";
import { CircularProgress, Icon } from "@amplication/design-system";
import "./GithubTileFooter.scss";
import { GitRepository } from "../SyncWithGithubTile";
import { githubOrganizationImageUrl } from "../../util/github";
import { format } from "date-fns";

const CLASS_NAME = "github-tile-footer";

interface Props {
  loading: boolean;
  gitRepository?: GitRepository;
}

const GithubTileFooter: React.FC<Props> = ({ loading, gitRepository }) => {
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__user-details`}>
        {!gitRepository ? (
          <>
            <Icon
              className={`${CLASS_NAME}__user-details__info-icon`}
              icon="info_circle"
            />{" "}
            <div>You are not connected to a GitHub repository</div>
          </>
        ) : (
          <>
            <img
              className={`${CLASS_NAME}__user-details__dp`}
              src={githubOrganizationImageUrl(
                gitRepository?.gitOrganization?.name
              )}
              alt="Git organization"
            />
            <div className={`${CLASS_NAME}__user-details__name`}>
              {gitRepository?.gitOrganization?.name}/{gitRepository?.name}
            </div>
          </>
        )}
      </div>
      {gitRepository && (
        <div className={`${CLASS_NAME}__sync-details`}>
          <Icon icon={"history_commit_outline"} size="medium" />
          <div className={`${CLASS_NAME}__sync-details__text`}>
            {gitRepository?.githubLastSync ? (
              <>
                Last sync:{" "}
                {format(new Date(gitRepository?.githubLastSync), "Pp")}
              </>
            ) : (
              "Not synced yet"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GithubTileFooter;
