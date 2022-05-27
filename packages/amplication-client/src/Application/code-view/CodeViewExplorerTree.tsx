import { TreeView } from "@amplication/design-system";
import React, { useCallback, useEffect, useState } from "react";
import { Build } from "../../models";
import "./CodeViewBar.scss";
import { FileDetails } from "./CodeViewPage";
import { FileExplorerNode } from "./FileExplorerNode";
import { NodeTypeEnum } from "./NodeTypeEnum";
import { StorageBaseAxios } from "./StorageBaseAxios";

const CLASS_NAME = "code-view-bar";
type Props = {
  selectedBuild: Build;
  onFileSelected: (selectedFile: FileDetails) => void;
};

export class FileMeta {
  type!: NodeTypeEnum;
  name!: string;
  path!: string;
  children?: FileMeta[] | undefined;
}

const NO_FILES_MESSAGE = "There are no available files to show for this build";

const INITIAL_ROOT_NODE = {
  type: NodeTypeEnum.Folder,
  name: "root",
  path: "/",
  children: [],
};

const CodeViewExplorerTree = ({ selectedBuild, onFileSelected }: Props) => {
  const [rootFile, setRootFile] = useState<FileMeta>(INITIAL_ROOT_NODE);

  const getFolderContent = useCallback(
    async (appId: string, buildId: string, file: FileMeta) => {
      file.children = await loadFolderContent(appId, buildId, file.path);
      console.log({ child: file.children });
      setRootFile({ ...rootFile });
    },
    [rootFile]
  );

  useEffect(() => {
    setRootFile({
      ...INITIAL_ROOT_NODE,
    });
    getFolderContent(selectedBuild.appId, selectedBuild.id, rootFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBuild]);

  const handleNodeClick = useCallback(
    async (file: FileMeta) => {
      switch (file.type) {
        case NodeTypeEnum.File:
          onFileSelected({
            buildId: selectedBuild.id,
            filePath: file.path,
            isFile: true,
            fileName: file.name,
          });
          break;
        case NodeTypeEnum.Folder:
          if (file.children && file.children.length > 0) {
            return;
          }
          await getFolderContent(selectedBuild.appId, selectedBuild.id, file);
          break;
      }
    },
    [selectedBuild, getFolderContent, onFileSelected]
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

  return (
    <div className={CLASS_NAME}>
      {selectedBuild && (
        <div>
          {rootFile.children?.length ? (
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
          ) : (
            NO_FILES_MESSAGE
          )}
        </div>
      )}
    </div>
  );
};

export default CodeViewExplorerTree;
