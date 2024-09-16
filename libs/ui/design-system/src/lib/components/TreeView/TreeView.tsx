import React, { Ref, useCallback } from "react";

import {
  SimpleTreeView as MuiTreeView,
  TreeItem as MuiTreeItem,
  TreeViewProps as MuiTreeViewProps,
  TreeItemProps as MuiTreeItemProps,
} from "@mui/x-tree-view";
import { Icon } from "../Icon/Icon";
import "./TreeView.scss";

const CLASS_NAME = "amp-tree-view";

export type TreeViewProps = MuiTreeViewProps<false> & {
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
  itemId,
  label,
  icon,
  data,
  children,
  farContent,
  onNodeClick,
  slots = {},
  ...rest
}: TreeItemProps) {
  const onClick = useCallback(() => {
    onNodeClick && onNodeClick(itemId, data);
  }, [onNodeClick, data, itemId]);

  const content = (
    <div className={`${CLASS_NAME}__Item__content`}>
      <span title={label}>{label} </span>
    </div>
  );

  return (
    <MuiTreeItem
      {...rest}
      onClick={onClick}
      itemId={itemId}
      label={content}
      slots={{
        ...slots,
        icon: () => {
          return <>{farContent ?? <Icon icon={icon} />}</>;
        },
      }}
    >
      {children}
    </MuiTreeItem>
  );
}
