import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { match } from "react-router-dom";
import { App } from "../../models";
import { FilesPanel } from "../../util/teleporter";
import { GET_APP_GIT_REPOSITORY } from "../git/SyncWithGithubPage";
import CodeViewBar from "./CodeViewBar";
import CodeViewEditor from "./CodeViewEditor";
import "./CodeViewPage.scss";

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

  console.log({ fileDetails });

  const { data } = useQuery<{ app: App }>(GET_APP_GIT_REPOSITORY, {
    variables: {
      appId: applicationId,
    },
  });
  if (!data) {
    return <div />;
  }
  return (
    <>
      <FilesPanel.Source>
        {data.app && (
          <CodeViewBar app={data.app} setFileDetails={setFileDetails} />
        )}
      </FilesPanel.Source>
      {fileDetails?.isFile && (
        <CodeViewEditor
          appId={applicationId}
          buildId={fileDetails.buildId}
          filePath={fileDetails.filePath}
          fileName={fileDetails.fileName}
        />
      )}
    </>
  );
}

export default CodeViewPage;
