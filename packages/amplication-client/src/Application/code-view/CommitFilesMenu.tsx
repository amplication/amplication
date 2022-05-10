import { RichObjectTreeView } from "@amplication/design-system";
import React from "react";
//import axios from "axios";
//import * as models from "../../models";

type Props = {
  applicationId: string;
  buildId?: string;
  path: string;
  onFileSelected: (nodeId: string) => void;
};

const CommitFilesMenu = ({
  applicationId,
  buildId,
  path = "",
  onFileSelected,
}: Props) => {
  //const [files, setFilesTree] = useState<Files>();

  const handleSelect = (event: React.SyntheticEvent, nodeId: string) => {
    if (nodeId.includes("file")) {
      onFileSelected(nodeId);
    }
  };

  // axios
  //   .get(`http://storage/${applicationId}/${buildId}/list?${path}`)
  //   .then((res) => {
  //     const treeFiles = res.data;
  //     setFilesTree(treeFiles);
  //     console.log(files);
  //   });

  return (
    <div>
      <RichObjectTreeView
        onNodeSelect={(event, nodeId) => {
          handleSelect(event, nodeId);
        }}
      />
    </div>
  );
};

export default CommitFilesMenu;
