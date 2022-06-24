import { gql, useQuery } from "@apollo/client";
import React, { useState } from "react";
import { App, Build, SortOrder } from "../../models";
import BuildSelector from "../../Components/BuildSelector";
import { FileDetails } from "./CodeViewPage";
import { NodeTypeEnum } from "./NodeTypeEnum";
import CodeViewExplorerTree from "./CodeViewExplorerTree";
import "./CodeViewBar.scss";

const CLASS_NAME = "code-view-bar";

type Props = {
  app: App;
  onFileSelected: (selectedFile: FileDetails | null) => void;
};

export type FileMeta = {
  type: NodeTypeEnum;
  name: string;
  path: string;
  children?: FileMeta[] | undefined;
  expanded?: boolean;
};

export const CREATED_AT_FIELD = "createdAt";
type TData = {
  builds: Build[];
};

const CodeViewExplorer: React.FC<Props> = ({ app, onFileSelected }) => {
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);

  const handleSelectedBuild = (build: Build) => {
    setSelectedBuild(build);
    onFileSelected(null);
  }

  const { data } = useQuery<TData>(GET_BUILDS_COMMIT, {
    variables: {
      appId: app.id,
      orderBy: {
        [CREATED_AT_FIELD]: SortOrder.Desc,
      },
    },
    onCompleted: async (data) => {
      handleSelectedBuild(data.builds[0]);
    },
  });

  return !data ? (<div />) : (
    <div className={CLASS_NAME}>
      <div>
        <BuildSelector
          app={app}
          builds={data.builds}
          selectedBuild={selectedBuild}
          onSelectBuild={handleSelectedBuild}
        />
      </div>
      {selectedBuild && (
        <CodeViewExplorerTree
          selectedBuild={selectedBuild}
          onFileSelected={onFileSelected}
        />
      )}
    </div>
  );
};

export default CodeViewExplorer;

export const GET_BUILDS_COMMIT = gql`
  query builds(
    $appId: String!
    $orderBy: BuildOrderByInput
    $whereMessage: StringFilter
  ) {
    builds(
      where: { app: { id: $appId }, message: $whereMessage }
      orderBy: $orderBy
    ) {
      id
      message
      createdAt
      appId
    }
  }
`;
