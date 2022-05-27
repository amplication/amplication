import { TreeView } from "@amplication/design-system";
import React, { useCallback, useEffect, useState } from "react";
import { Build } from "../../models";
import { FileDetails } from "./CodeViewPage";
import { FileExplorerNode } from "./FileExplorerNode";
import { NodeTypeEnum } from "./NodeTypeEnum";
import { StorageBaseAxios, StorageResponseType } from "./StorageBaseAxios";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import "./CodeViewBar.scss";


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
  const [selectedFolder, setSelectedFolder] = useState<FileMeta>(rootFile);

  const { error, isError } = useQuery<StorageResponseType, AxiosError>(
    ["storage-folderList", selectedBuild.id, selectedFolder?.path],
    async () => {
      return await StorageBaseAxios.instance.folderList(
        selectedBuild.appId,
        selectedBuild.id,
        selectedFolder?.path
      );
    },
    {
      onSuccess: (data) => {
        selectedFolder.children = data.result;
        setRootFile({ ...rootFile });
      },
    }
  );

  useEffect(() => {
    //reset the state when the build changes 
    const newRootFile = { ...INITIAL_ROOT_NODE };
    setRootFile(newRootFile);
    setSelectedFolder(newRootFile);
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
          await setSelectedFolder(file);
          break;
      }
    },
    [selectedBuild, onFileSelected]
  );

  return (
    <div className={CLASS_NAME}>
      {selectedBuild && (
        <div>
          {isError && error}
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
