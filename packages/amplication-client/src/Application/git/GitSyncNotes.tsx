import { Icon } from "@amplication/design-system";
import React from "react";
import { CLASS_NAME } from "./AuthAppWithGit";

export default function GitSyncNotes() {
  return (
    <div className={`${CLASS_NAME}__notice`}>
      Please note:
      <ul>
        <li>
          <Icon icon="check_circle" />
          The changes will be pushed to the root of the selected repository,
          using Pull Requests.
        </li>
        <li>
          <Icon icon="check_circle" />
          The selected repository must not be empty.
        </li>
      </ul>
    </div>
  );
}
