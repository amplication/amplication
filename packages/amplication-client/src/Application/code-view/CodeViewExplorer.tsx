import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
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

export class FileMeta {
  type!: NodeTypeEnum;
  name!: string;
  path!: string;
  children?: FileMeta[] | undefined;
  expanded?: boolean;
}

const CREATED_AT_FIELD = "createdAt";
type TData = {
  builds: Build[];
};

const CodeViewExplorer = ({ app, onFileSelected }: Props) => {
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);

  const { data } = useQuery<TData>(GET_BUILDS_COMMIT, {
    variables: {
      appId: app.id,
      orderBy: {
        [CREATED_AT_FIELD]: SortOrder.Desc,
      },
    },
    onCompleted: async (data) => {
      setSelectedBuild(data.builds[0]);
    },
  });

  const handleSelectBuild = (build: Build) => {
    setSelectedBuild(build);
  };

  useEffect(() => {
    onFileSelected(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuild]);

  if (!data) {
    return <div />;
  }

  return (
    <div className={CLASS_NAME}>
      <div>
        <BuildSelector
          app={app}
          builds={data.builds}
          buildId={selectedBuild?.id}
          buildTitle={selectedBuild?.message || selectedBuild?.createdAt}
          onSelectBuild={handleSelectBuild}
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
