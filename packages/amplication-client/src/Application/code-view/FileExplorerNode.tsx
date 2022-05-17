import { TreeItem } from "@amplication/design-system";
import React, { useCallback, useMemo } from "react";
import { FileMeta } from "./CodeViewBar";
import { NodeTypeEnum } from "./NodeTypeEnum";

export type FileExplorerNodeProps = {
  file: FileMeta;
  onSelect: (data: FileMeta) => void;
};

export const FileExplorerNode = ({ file, onSelect }: FileExplorerNodeProps) => {
  const handleNodeClick = useCallback(
    (id: string, file: FileMeta) => {
      onSelect && onSelect(file);
    },
    [onSelect]
  );

  const iconName = useMemo(
    () => (file.type === NodeTypeEnum.Folder ? "folder" : "file"),
    [file.type]
  );

  return (
    <TreeItem
      onSelect={handleNodeClick}
      data={file}
      id={file?.path}
      label={file?.name}
      icon={iconName}
    >
      {file.children?.map((child) => {
        return (
          <FileExplorerNode file={child} key={child.path} onSelect={onSelect} />
        );
      })}
    </TreeItem>
  );
};
