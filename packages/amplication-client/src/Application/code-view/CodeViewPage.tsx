import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { match } from "react-router-dom";
import { App } from "../../models";
import { GET_APP_GIT_REPOSITORY } from "../git/SyncWithGithubPage";
import CodeViewBar from "./CodeViewBar";
import CodeViewEditor from "./CodeViewEditor";
import useNavigationTabs from "../../Layout/UseNavigationTabs";
import PageContent from "../../Layout/PageContent";

import "./CodeViewPage.scss";

const CLASS_NAME = "code-view-page";
const NAVIGATION_KEY = "CODE_VIEW";
type Props = {
  match: match<{ application: string }>;
};

export type CommitListItem = {
  id: string;
  name: string;
};

export type FileDetails = {
  buildId: string;
  filePath: string;
  isFile: boolean;
  fileName: string;
};

function CodeViewPage({ match }: Props) {
  const applicationId = match.params.application;
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const pageTitle = "Code View"
  useNavigationTabs(applicationId, NAVIGATION_KEY, match.url, pageTitle);

  const { data } = useQuery<{ app: App }>(GET_APP_GIT_REPOSITORY, {
    variables: {
      appId: applicationId,
    },
  });
  if (!data) {
    return <div />;
  }
  return (
    <PageContent
      pageTitle={pageTitle}
      sideContent={
        <CodeViewBar app={data.app} onFileSelected={setFileDetails} />
      }
    >
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__code-container`}>
          {fileDetails?.isFile && (
            <CodeViewEditor
              appId={applicationId}
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
