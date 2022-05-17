import { SearchField, TreeView } from "@amplication/design-system";
import { gql, useQuery } from "@apollo/client";
import { isEmpty } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { App, Build, SortOrder } from "../../models";
import "./CodeViewBar.scss";
import CodeViewCommits from "./CodeViewCommits";
import CodeViewSyncWithGithub from "./CodeViewSyncWithGithub";
import { FileExplorerNode } from "./FileExplorerNode";
import { NodeTypeEnum } from "./NodeTypeEnum";
import { StorageBaseAxios } from "./StorageBaseAxios";

const CLASS_NAME = "code-view-bar";
type Props = {
  app: App;
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

const CodeViewBar = ({ app }: Props) => {
  const { gitRepository } = app;
  const history = useHistory();
  const [rootFile, setRootFile] = useState<FileMeta>(initialRootNode);
  const { data } = useQuery<TData>(GET_BUILDS_COMMIT, {
    variables: {
      appId: app.id,
      orderBy: {
        [CREATED_AT_FIELD]: SortOrder.Desc,
      },
    },
    onCompleted: async (data) => {
      setBuild(data.builds[0]);
      await handleNodeClick(rootFile);
    },
  });

  const [build, setBuild] = useState<Build | null>(null);

  const handleAuthWithGitClick = () => {
    window.open(`/${app.id}/github`);
  };

  const handleOnSearchChange = (searchParse: string) => {
    // let file: FileObject = new FileObject();
    // let filesTree: Files = new Files();
    // filesTree.files = new Array(4);
    // body.files
    //   .filter((file) => file.name.includes(searchParse))
    //   .map(
    //     (resFile) => ((file.name = resFile.name), (file.type = resFile.type)),
    //     filesTree.files.push(file)
    //   );
    // console.log(filesTree.files);
    // setFilesTree(filesTree);
    // console.log(files);
  };

  useEffect(() => {
    if (!build) {
      return;
    }
    getFolderContent(app.id, build.id, initialRootNode);
  }, [build]);

  const handleSetBuild = (build: Build) => {
    history.push(`/${app.id}/code-view/${app.id}/${build.id}/`);
    setBuild(build);
  };
  const getFolderContent = useCallback(
    async (appId: string, buildId: string, file: FileMeta) => {
      file.children = await loadFolderContent(appId, buildId, file.path);
      setRootFile({ ...rootFile });
    },
    [rootFile]
  );
  const handleNodeClick = useCallback(
    async (file: FileMeta) => {
      if (!build) {
        return;
      }
      if (file.children && file.children.length > 0) {
        return;
      }

      switch (file.type) {
        case NodeTypeEnum.File:
          history.push(
            `/${app.id}/code-view/${app.id}/${build.id}?path=${file.path}`
          );
          break;
        case NodeTypeEnum.Folder:
          getFolderContent(app.id, build.id, file);
          break;
      }

      setRootFile({ ...rootFile });
    },
    [build, rootFile, history, app.id, getFolderContent]
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
        <CodeViewCommits
          builds={data.builds}
          buildId={build?.id}
          buildTitle={build?.message || build?.createdAt}
          onSelectBuild={handleSetBuild}
        />
      </div>
      <div>
        <SearchField
          label={"search files"}
          placeholder={"search files"}
          onChange={handleOnSearchChange}
        />
      </div>
      {build && (
        <div>
          <TreeView>
            {rootFile.children?.map((child) => {
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
