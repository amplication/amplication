import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { match } from "react-router-dom";
import { Resource } from "../../models";
import { GET_RESOURCE_GIT_REPOSITORY } from "../git/SyncWithGithubPage";
import CodeViewBar from "./CodeViewBar";
import CodeViewEditor from "./CodeViewEditor";
import useNavigationTabs from "../../Layout/UseNavigationTabs";
import PageContent from "../../Layout/PageContent";

import "./CodeViewPage.scss";

const CLASS_NAME = "code-view-page";
const NAVIGATION_KEY = "CODE_VIEW";
type Props = {
  match: match<{ resource: string }>;
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
  const resourceId = match.params.resource;
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  useNavigationTabs(resourceId, NAVIGATION_KEY, match.url, "Code View");

  const { data } = useQuery<{ resource: Resource }>(
    GET_RESOURCE_GIT_REPOSITORY,
    {
      variables: {
        resourceId,
      },
    }
  );
  if (!data) {
    return <div />;
  }
  return (
    <PageContent
      sideContent={
        <CodeViewBar resource={data.resource} onFileSelected={setFileDetails} />
      }
    >
      <div className={CLASS_NAME}>
        <div className={`${CLASS_NAME}__code-container`}>
          {fileDetails?.isFile && (
            <CodeViewEditor
              resourceId={resourceId}
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
