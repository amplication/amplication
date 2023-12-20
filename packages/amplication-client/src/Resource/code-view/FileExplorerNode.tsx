import { Icon, TreeItem } from "@amplication/ui/design-system";
import React, { useCallback, useMemo } from "react";
import { NodeTypeEnum } from "./NodeTypeEnum";
import { FileMeta } from "./CodeViewExplorer";

export type FileExplorerNodeProps = {
  file: FileMeta;
  onSelect: (data: FileMeta) => void;
};

export const FileExplorerNode = ({ file, onSelect }: FileExplorerNodeProps) => {
  const handleNodeClick = useCallback(
    (id: string, file: FileMeta) => {
      file && onSelect(file);
    },
    [onSelect]
  );

  const iconName = useMemo(
    () => (file.type === NodeTypeEnum.Folder ? "folder" : "file"),
    [file.type]
  );

  const farIcon = useMemo(() => {
    if (file.type !== NodeTypeEnum.Folder) return null;

    return file.expanded ? (
      <Icon icon="chevron_down" />
    ) : (
      <Icon icon="chevron_right" />
    );
  }, [file.expanded, file.type]);

  return (
    <TreeItem
      onNodeClick={handleNodeClick}
      data={file}
      nodeId={file?.path}
      label={file?.name}
      icon={iconName}
      farContent={farIcon}
    >
      {file.children?.map((child) => {
        return (
          <FileExplorerNode file={child} key={child.path} onSelect={onSelect} />
        );
      })}
    </TreeItem>
  );
};
