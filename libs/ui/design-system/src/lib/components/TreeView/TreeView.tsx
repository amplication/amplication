import React, { Ref, useCallback } from "react";
import { TreeView as MuiTreeView, TreeItem as MuiTreeItem } from "@mui/lab";
import { TreeViewProps as MuiTreeViewProps } from "@mui/lab/TreeView";
import { TreeItemProps as MuiTreeItemProps } from "@mui/lab/TreeItem";
import { Icon } from "../Icon/Icon";
import "./TreeView.scss";

const CLASS_NAME = "amp-tree-view";

export type TreeViewProps = MuiTreeViewProps & {
  children?: React.ReactNode;
  ref?: Ref<HTMLLIElement> | undefined;
};

export function TreeView({ children, ref, ...rest }: TreeViewProps) {
  return (
    <MuiTreeView {...rest} className={CLASS_NAME}>
      {children}
    </MuiTreeView>
  );
}

export type TreeItemProps = MuiTreeItemProps & {
  label: string;
  icon: string;
  data?: any;
  children?: React.ReactNode;
  farContent?: React.ReactNode;
  onNodeClick: (id: string, data?: any) => void;
  ref?: Ref<HTMLLIElement> | undefined;
};

export function TreeItem({
  nodeId,
  label,
  icon,
  data,
  children,
  farContent,
  onNodeClick,
  ...rest
}: TreeItemProps) {
  const onClick = useCallback(() => {
    onNodeClick && onNodeClick(nodeId, data);
  }, [onNodeClick, data, nodeId]);

  const content = (
    <div className={`${CLASS_NAME}__Item__content`}>
      <span>{label} </span> {farContent}
    </div>
  );

  return (
    <MuiTreeItem
      {...rest}
      onClick={onClick}
      nodeId={nodeId}
      label={content}
      icon={<Icon icon={icon} size="small" />}
    >
      {children}
    </MuiTreeItem>
  );
}
