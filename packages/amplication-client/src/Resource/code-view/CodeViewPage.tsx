import React, { useState } from "react";
import CodeViewBar from "./CodeViewBar";
import CodeViewEditor from "./CodeViewEditor";
import PageContent, { EnumPageWidth } from "../../Layout/PageContent";

import "./CodeViewPage.scss";
import { EnumImages, SvgThemeImage } from "../../Components/SvgThemeImage";
import useBreadcrumbs from "../../Layout/useBreadcrumbs";
import { AppRouteProps } from "../../routes/routesUtil";
import { match } from "react-router-dom";
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

type Props = AppRouteProps & {
  match: match<{
    projectId: string;
  }>;
};

function CodeViewPage({ match }: Props) {
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const pageTitle = "Code View";

  useBreadcrumbs("Code View", match.url);

  return (
    <PageContent
      pageTitle={pageTitle}
      sideContent={<CodeViewBar onFileSelected={setFileDetails} />}
      pageWidth={EnumPageWidth.Full}
    >
      <div className={CLASS_NAME}>
        {fileDetails?.isFile ? (
          <div className={`${CLASS_NAME}__code-container`}>
            <CodeViewEditor
              resourceId={fileDetails.resourceId}
              buildId={fileDetails.buildId}
              filePath={fileDetails.filePath}
              fileName={fileDetails.fileName}
            />
          </div>
        ) : (
          <div className={`${CLASS_NAME}__empty-state`}>
            <SvgThemeImage image={EnumImages.CodeViewEmptyState} />
            <span>There is no code to view</span>
          </div>
        )}
      </div>
    </PageContent>
  );
}

export default CodeViewPage;
