import { Icon } from "@amplication/ui/design-system";
import React from "react";

const CLASS_NAME = "auth-app-with-git";

export default function GitSyncNotes() {
  return (
    <div className={`${CLASS_NAME}__notice`}>
      <span className={`${CLASS_NAME}__notice__title`}>Please note:</span>
      <ul>
        <li>
          <Icon icon="check_square" size="xsmall" />
          You can connect multiple services to the same repository, next you
          will see the option to select the destination folder
        </li>
        <li>
          <Icon icon="check_square" size="xsmall" />
          The selected repository must not be empty
        </li>
      </ul>
    </div>
  );
}
