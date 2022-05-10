import React from "react";
import TreeView from "@mui/lab/TreeView";
import TreeItem from "@mui/lab/TreeItem";
import { Icon } from "../..";

type Props = {
  onNodeSelect: (event: React.SyntheticEvent, nodeId: string) => void;
};
interface RenderTree {
  id: string;
  type: string;
  name: string;
  children?: readonly RenderTree[];
}

const data: RenderTree = {
  id: "root",
  type: "",
  name: "Parent",
  children: [
    {
      id: "1",
      type: "file",
      name: "src",
    },
    {
      id: "2",
      type: "file",
      name: "src2",
    },
    {
      id: "3",
      type: "folder",
      name: "package.json",
    },
  ],
};

export function RichObjectTreeView({ onNodeSelect }: Props) {
  //{ files }: Props
  //const [expanded, setExpanded] = useState<string[]>([]);
  //const [selected, setSelected] = useState<string[]>([]);

  const renderTree = (nodes: RenderTree) => (
    <TreeItem
      key={nodes.name}
      nodeId={nodes.id + nodes.type}
      label={nodes.name}
    >
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
      onNodeSelect={(event: React.SyntheticEvent, nodeId: string) =>
        onNodeSelect(event, nodeId)
      }
      sx={{ height: 110, flexGrow: 1, maxWidth: 400, overflowY: "auto" }}
    >
      {renderTree(data)}
    </TreeView>
  );
}
