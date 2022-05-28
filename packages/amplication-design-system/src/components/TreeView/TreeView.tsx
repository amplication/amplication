import React, { useCallback } from "react";
import MuiTreeView, {
  TreeViewProps as MuiTreeViewProps,
} from "@mui/lab/TreeView";
import MuiTreeItem, {
  TreeItemProps as MuiTreeItemProps,
} from "@mui/lab/TreeItem";
import { Icon } from "../..";
import "./TreeView.scss";

const CLASS_NAME = "amp-tree-view";

export type TreeViewProps = MuiTreeViewProps & {
  children?: React.ReactNode;
};

export function TreeView({ children, ...rest }: TreeViewProps) {
  return (
    <MuiTreeView {...rest} className={CLASS_NAME}>
      {children}
    </MuiTreeView>
  );
}

export type TreeItemProps = MuiTreeItemProps & {
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
  ...rest
}: TreeItemProps) {
  const onClick = useCallback(() => {
    onSelect && onSelect(id, data);
  }, [onSelect, data, id]);

  return (
    <MuiTreeItem
      {...rest}
      onClick={onClick}
      nodeId={id}
      label={label}
      icon={<Icon icon={icon} size="small" />}
    >
      {children}
    </MuiTreeItem>
  );
}
