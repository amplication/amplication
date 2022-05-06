import React from "react";
import { Icon } from "@amplication/design-system";
import "./GithubTileFooter.scss";

const CLASS_NAME = "github-tile-footer";

const GithubTileFooter: React.FC = () => {
  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__user-details`}>
        <div className={`${CLASS_NAME}__user-details__circle-badge`}>M</div>
        <div className={`${CLASS_NAME}__user-details__name`}>
          alexbass86/alexbass86
        </div>
      </div>
      <div className={`${CLASS_NAME}__sync-details`}>
        <Icon icon={"history_commit_outline"} size="medium" />
        <div className={`${CLASS_NAME}__sync-details__text`}>
          Last sync: 04/04/2022 3:13 PM
        </div>
      </div>
    </div>
  );
};

export default GithubTileFooter;
