import React, { useCallback } from "react";
import MuiTreeView from "@mui/lab/TreeView";
import MuiTreeItem from "@mui/lab/TreeItem";
import { Icon } from "../..";

export type TreeViewProps = {
  children?: React.ReactNode;
  onNodeSelected?: (event: React.SyntheticEvent, nodeIds: string) => void;
  onNodeToggle?: (event: React.SyntheticEvent, nodeIds: string[]) => void;
  expanded?: string[];
};

export function TreeView({
  children,
  onNodeSelected,
  expanded,
  onNodeToggle,
}: TreeViewProps) {
  return (
    <MuiTreeView
      onNodeSelect={onNodeSelected}
      expanded={expanded || undefined}
      onNodeToggle={onNodeToggle}
    >
      {children}
    </MuiTreeView>
  );
}

export type TreeItemProps = {
  label: string;
  id: string;
  icon: string;
  data?: any;
  children?: React.ReactNode;
  onSelect: (id: string, data?: any) => void;
};

export function TreeItem({
  label,
  id,
  icon,
  data,
  children,
  onSelect,
}: TreeItemProps) {
  const onClick = useCallback(() => {
    onSelect && onSelect(id, data);
  }, [onSelect, data, id]);

  return (
    <MuiTreeItem
      onClick={onClick}
      nodeId={id}
      label={label}
      icon={<Icon icon={icon} size="small" />}
    >
      {children}
    </MuiTreeItem>
  );
}
