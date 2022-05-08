import React from "react";
import { RichObjectTreeView } from "@amplication/design-system";
//import * as models from "../../models";

// type TData = {
//   pendingChanges: models.PendingChange[];
// };

type Props = {
  applicationId: string;
};

const CommitFilesMenu = ({ applicationId }: Props) => {
  return (
    <div>
      <RichObjectTreeView />
    </div>
  );
};

export default CommitFilesMenu;
