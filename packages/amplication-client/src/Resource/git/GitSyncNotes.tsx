import { Icon } from "@amplication/ui/design-system";
import React from "react";
import { CLASS_NAME } from "./AuthResourceWithGit";

export default function GitSyncNotes() {
  return (
    <div className={`${CLASS_NAME}__notice`}>
      <span className={`${CLASS_NAME}__notice__title`}>Please note:</span>
      <ul>
        <li>
          <Icon icon="check_circle" />
          You can connect multiple services to the same repository, next you
          will see the option to select the destination folder
        </li>
      </ul>
    </div>
  );
}
