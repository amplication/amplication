import React from "react";
import CommitResourceListItem from "./CommitResourceListItem";
import * as models from "../models";
import DataPanel, { TitleDataType } from "./DataPanel";
import "./CommitResourceList.scss";
import { EnumImages } from "../Components/SvgThemeImage";
import { EmptyState } from "../Components/EmptyState";
import { CommitChangesByResource } from "./hooks/useCommits";

type Props = {
  commit: models.Commit;
  commitChangesByResource: CommitChangesByResource;
};

const CLASS_NAME = "commit-resource-list";
const CommitResourceList: React.FC<Props> = ({
  commit,
  commitChangesByResource,
}) => {
  return (
    <div className={CLASS_NAME}>
      <DataPanel
        id={commit.id}
        dataType={TitleDataType.COMMIT}
        createdAt={commit?.createdAt}
        account={commit?.user?.account}
      />
      <div className={`${CLASS_NAME}__content`}>
        {commit.builds && commit.builds.length > 0 && (
          <div className={`${CLASS_NAME}__title`}>Builds</div>
        )}
        {commit.builds && commit.builds.length ? (
          commit.builds.map((build: models.Build) => (
            <CommitResourceListItem
              key={build.id}
              build={build}
              commitChangesByResource={commitChangesByResource}
            />
          ))
        ) : (
          <EmptyState
            message="There are no builds to show"
            image={EnumImages.CommitEmptyState}
          />
        )}
      </div>
    </div>
  );
};

export default CommitResourceList;
