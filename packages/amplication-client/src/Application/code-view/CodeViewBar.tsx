import { TreeView } from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { App, Build, SortOrder } from "../../models";
import "./CodeViewBar.scss";
import BuildSelector from "../../Components/BuildSelector";
import { FileDetails } from "./CodeViewPage";
import CodeViewSyncWithGithub from "./CodeViewSyncWithGithub";
import { FileExplorerNode } from "./FileExplorerNode";
import { NodeTypeEnum } from "./NodeTypeEnum";
import { StorageBaseAxios } from "./StorageBaseAxios";

const CLASS_NAME = "code-view-bar";
type Props = {
  app: App;
  setFileDetails: (fileDetails: FileDetails) => void;
};
type BuildWithFiles = {
  build: Build | null;
  rootFile: FileMeta;
};

export class FileMeta {
  type!: NodeTypeEnum;
  name!: string;
  path!: string;
  children?: FileMeta[] | undefined;
}

const CREATED_AT_FIELD = "createdAt";
type TData = {
  builds: Build[];
};

const initialRootNode = {
  type: NodeTypeEnum.Folder,
  name: "root",
  path: "/",
  children: [],
};

const CodeViewBar = ({ app, setFileDetails }: Props) => {
  const { gitRepository } = app;
  const history = useHistory();
  const [selectedBuild, setSelectedBuild] = useState<BuildWithFiles>({
    build: null,
    rootFile: initialRootNode,
  });

  const { data } = useQuery<TData>(GET_BUILDS_COMMIT, {
    variables: {
      appId: app.id,
      orderBy: {
        [CREATED_AT_FIELD]: SortOrder.Desc,
      },
    },
    onCompleted: async (data) => {
      setSelectedBuild({ build: data.builds[0], rootFile: initialRootNode });
      await handleNodeClick(selectedBuild.rootFile);
    },
  });

  const handleAuthWithGitClick = () => {
    window.open(`/${app.id}/github`);
  };

  const getFolderContent = useCallback(
    async (appId: string, buildId: string, file: FileMeta) => {
      file.children = await loadFolderContent(appId, buildId, file.path);
      setSelectedBuild({ ...selectedBuild });
    },
    [selectedBuild]
  );

  useEffect(() => {
    if (!selectedBuild.build) {
      return;
    }
    getFolderContent(app.id, selectedBuild.build.id, initialRootNode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuild.build, app.id]);

  const handleSetBuild = (build: Build) => {
    setSelectedBuild({ build: build, rootFile: initialRootNode });
    history.push(`/${app.id}/code-view/`);
  };

  const handleNodeClick = useCallback(
    async (file: FileMeta) => {
      if (!selectedBuild || !selectedBuild.build) {
        return;
      }
      if (file.children && file.children.length > 0) {
        return;
      }
      switch (file.type) {
        case NodeTypeEnum.File:
          setFileDetails({
            buildId: selectedBuild.build.id,
            filePath: file.path,
            isFile: true,
            fileName: file.name,
          });
          break;
        case NodeTypeEnum.Folder:
          await getFolderContent(app.id, selectedBuild.build.id, file);
          setSelectedBuild({ ...selectedBuild });
          break;
      }
    },
    [selectedBuild, setFileDetails, app.id, getFolderContent]
  );

  const loadFolderContent = async (
    appId: string,
    buildId: string,
    path: string
  ): Promise<FileMeta[]> => {
    const data = await StorageBaseAxios.instance.folderList(
      appId,
      buildId,
      path
    );

    return data.result;
  };

  if (!data) {
    return <div />;
  }

  return (
    <div className={CLASS_NAME}>
      <div className={`${CLASS_NAME}__heading`}>
        <h2>File Browser</h2>
      </div>
      {isEmpty(gitRepository) && (
        <CodeViewSyncWithGithub
          onSyncNewGitOrganizationClick={handleAuthWithGitClick}
        />
      )}
      {app.gitRepository && (
        <div>
          <p>connected to: </p>
          {app.gitRepository?.gitOrganization.name}
        </div>
      )}
      <div>
        <BuildSelector
          builds={data.builds}
          buildId={selectedBuild.build?.id}
          buildTitle={
            selectedBuild.build?.message || selectedBuild.build?.createdAt
          }
          onSelectBuild={handleSetBuild}
        />
      </div>
      {selectedBuild && (
        <div>
          <TreeView>
            {selectedBuild.rootFile.children?.map((child) => {
              return (
                <FileExplorerNode
                  file={child}
                  key={child.path + JSON.stringify(child.children)}
                  onSelect={handleNodeClick}
                />
              );
            })}
          </TreeView>
        </div>
      )}
    </div>
  );
};

export default CodeViewBar;

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
    }
  }
`;
