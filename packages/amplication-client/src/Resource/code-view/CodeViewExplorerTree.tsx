import { Icon, TreeView } from "@amplication/design-system";
import React, { useCallback, useEffect, useState } from "react";
import { Build } from "../../models";
import { FileDetails } from "./CodeViewPage";
import { FileExplorerNode } from "./FileExplorerNode";
import { NodeTypeEnum } from "./NodeTypeEnum";
import { StorageBaseAxios, StorageResponseType } from "./StorageBaseAxios";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { remove } from "lodash";
import { FileMeta } from "./CodeViewExplorer";
import "./CodeViewBar.scss";

const CLASS_NAME = "code-view-bar";

type Props = {
  selectedBuild: Build;
  resourceId: string;
  onFileSelected: (selectedFile: FileDetails) => void;
};

const NO_FILES_MESSAGE = "There are no available files to show for this build";

const INITIAL_ROOT_NODE: FileMeta = {
  type: NodeTypeEnum.Folder,
  name: "root",
  path: "/",
  children: [],
  expanded: false,
};

const CodeViewExplorerTree = ({
  selectedBuild,
  resourceId,
  onFileSelected,
}: Props) => {
  const [rootFile, setRootFile] = useState<FileMeta>(INITIAL_ROOT_NODE);
  const [selectedFolder, setSelectedFolder] = useState<FileMeta>(rootFile);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const { error, isError } = useQuery<StorageResponseType, AxiosError>(
    ["storage-folderList", selectedBuild.id, selectedFolder?.path],
    async () => {
      return await StorageBaseAxios.instance.folderList(
        resourceId,
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
      const fileTypeMap = {
        [NodeTypeEnum.File]: () => {
          onFileSelected({
            buildId: selectedBuild.id,
            resourceId: resourceId,
            filePath: file.path,
            isFile: true,
            fileName: file.name,
          });
        },
        [NodeTypeEnum.Folder]: () => {
          const expandedNodes = [...expandedFolders];
          const removed = remove(expandedNodes, (item) => {
            return item === file.path;
          });
          if (!removed.length) {
            expandedNodes.push(file.path);
            file.expanded = true;
          } else {
            file.expanded = false;
          }
          setExpandedFolders(expandedNodes);
          setSelectedFolder(file);
        },
      };
      fileTypeMap[file.type]();
    },
    [selectedBuild, onFileSelected, expandedFolders, resourceId]
  );

  return (
    <div className={CLASS_NAME}>
      {selectedBuild && (
        <div>
          {isError && error}
          {rootFile.children?.length ? (
            <TreeView
              expanded={expandedFolders}
              defaultExpandIcon={<Icon icon="arrow_left" />}
              defaultCollapseIcon={<Icon icon="arrow_left" />}
            >
              {rootFile.children?.map((child) => (
                <FileExplorerNode
                  file={child}
                  key={child.path + JSON.stringify(child.children)}
                  onSelect={handleNodeClick}
                />
              ))}
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
