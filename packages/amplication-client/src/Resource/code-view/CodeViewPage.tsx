import React, { useState } from "react";
import CodeViewBar from "./CodeViewBar";
import CodeViewEditor from "./CodeViewEditor";
import PageContent from "../../Layout/PageContent";

import "./CodeViewPage.scss";

const CLASS_NAME = "code-view-page";

export type CommitListItem = {
  id: string;
  name: string;
};

export type FileDetails = {
  buildId: string;
  resourceId: string;
  filePath: string;
  isFile: boolean;
  fileName: string;
};

function CodeViewPage() {
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const pageTitle = "Code View";

  return (
    <PageContent
      pageTitle={pageTitle}
      sideContent={<CodeViewBar onFileSelected={setFileDetails} />}
    >
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__code-container`}>
          {fileDetails?.isFile && (
            <CodeViewEditor
              resourceId={fileDetails.resourceId}
              buildId={fileDetails.buildId}
              filePath={fileDetails.filePath}
              fileName={fileDetails.fileName}
            />
          )}
        </div>
      </div>
    </PageContent>
  );
}

export default CodeViewPage;
