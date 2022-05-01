import React from "react";
//import { CommitListItem } from "./CodeViewPage";
import * as models from "../../models";

//const CLASS_NAME = "menu-item-content";

type Props = {
  commit: models.Commit;
  isMenuTitle?: Boolean;
};
export const CommitMenuItemContent = ({
  commit: { message },
  isMenuTitle = false,
}: Props) => {
  return (
    <span>
      {/* <img
        className={`${CLASS_NAME}`}
        src={githubOrganizationImageUrl(name)}
        alt="Git organization"
      /> */}
      {isMenuTitle ? `${message} connected` : message}
    </span>
  );
};
