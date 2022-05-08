import React from "react";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import { Icon } from "../..";

interface RenderTree {
  id: string;
  name: string;
  children?: readonly RenderTree[];
}

const data: RenderTree = {
  id: "root",
  name: "Parent",
  children: [
    {
      id: "1",
      name: "Child - 1",
    },
    {
      id: "3",
      name: "Child - 3",
      children: [
        {
          id: "4",
          name: "Child - 4",
        },
      ],
    },
  ],
};

export function RichObjectTreeView() {
  const renderTree = (nodes: RenderTree) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => renderTree(node))
        : null}
    </TreeItem>
  );

  return (
    <TreeView
      aria-label="rich object"
      defaultCollapseIcon={<Icon icon="folder" size="small" />}
      defaultExpanded={["root"]}
      defaultExpandIcon={<Icon icon="file" size="small" />}
      sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      {renderTree(data)}
    </TreeView>
  );
}
