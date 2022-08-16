import { gql, useQuery } from "@apollo/client";
import React, { useContext, useState } from "react";
import BuildSelector from "../../Components/BuildSelector";
import ResourceSelector from "../../Components/ResourceSelector";
import { AppContext } from "../../context/appContext";
import { Build, Resource, SortOrder } from "../../models";
import "./CodeViewBar.scss";
import CodeViewExplorerTree from "./CodeViewExplorerTree";
import { FileDetails } from "./CodeViewPage";
import { NodeTypeEnum } from "./NodeTypeEnum";

const CLASS_NAME = "code-view-bar";

type Props = {
  resource: Resource;
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

const CodeViewExplorer: React.FC<Props> = ({ resource, onFileSelected }) => {
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const { resources } = useContext(AppContext);

  const handleSelectedBuild = (build: Build) => {
    setSelectedBuild(build);
    onFileSelected(null);
  };

  const handleSelectedResource = (resource: Resource) => {
    setSelectedResource(resource);
  };

  const { data } = useQuery<TData>(GET_BUILDS_COMMIT, {
    variables: {
      resourceId: resource.id,
      orderBy: {
        [CREATED_AT_FIELD]: SortOrder.Desc,
      },
    },
    onCompleted: async (data) => {
      handleSelectedBuild(data.builds[0]);
      handleSelectedResource(resources[0]);
    },
  });

  return !data ? (
    <div />
  ) : (
    <div className={CLASS_NAME}>
      <div>
        <BuildSelector
          resource={resource}
          builds={data.builds}
          selectedBuild={selectedBuild}
          onSelectBuild={handleSelectedBuild}
        />
        <ResourceSelector
          resource={resource}
          resources={resources}
          selectedResource={selectedResource}
          onSelectResource={handleSelectedResource}
        />
      </div>
      {selectedBuild && selectedResource && (
        <CodeViewExplorerTree
          selectedBuild={selectedBuild}
          resourceId={selectedResource.id}
          onFileSelected={onFileSelected}
        />
      )}
    </div>
  );
};

export default CodeViewExplorer;

export const GET_BUILDS_COMMIT = gql`
  query builds(
    $resourceId: String!
    $orderBy: BuildOrderByInput
    $whereMessage: StringFilter
  ) {
    builds(
      where: { resource: { id: $resourceId }, message: $whereMessage }
      orderBy: $orderBy
    ) {
      id
      message
      createdAt
      resourceId
    }
  }
`;
