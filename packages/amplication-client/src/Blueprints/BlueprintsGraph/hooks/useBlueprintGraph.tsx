import { useCallback, useEffect, useMemo, useState } from "react";
import { useEdgesState } from "reactflow";
import { Node } from "../types";

import { EnumMessageType } from "../../../util/useMessage";
import useBlueprints from "../../hooks/useBlueprints";
import { blueprintsToNodesAndEdges } from "../helpers";

type Props = {
  onMessage: (message: string, type: EnumMessageType) => void;
};

const useBlueprintGraph = ({ onMessage }: Props) => {
  const { findBlueprintsData } = useBlueprints();

  const blueprints = useMemo(
    () => findBlueprintsData?.blueprints || [],
    [findBlueprintsData]
  );

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [nodes, setNodes] = useState<Node[]>([]); // main data elements for save

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [errorMessage, setErrorMessage] = useState<string>(null);

  const setSelectRelatedNodes = useCallback(
    (node: Node) => {
      const relations = node.data.payload.relations;

      const relatedNodeIds = relations.map((relation) => {
        return relation.relatedTo;
      });

      if (relatedNodeIds.length === 0) return;

      relatedNodeIds.forEach((relatedNodeId) => {
        const currentNode = nodes.find((node) => node.id === relatedNodeId);
        currentNode.selected = !currentNode.selected;
      });

      node.data.selectRelatedNodes = false;
      setNodes((nodes) => [...nodes]);
    },
    [nodes]
  );

  const searchPhraseChanged = useCallback(
    (searchPhrase: string) => {
      nodes.forEach((x) => (x.data.highlight = false));

      if (searchPhrase !== "") {
        const searchResults = nodes.filter((node) =>
          node.data.payload.name
            .toLowerCase()
            .includes(searchPhrase.toLowerCase())
        );

        searchResults.forEach((searchedNode) => {
          searchedNode.data.highlight = true;
        });
      }

      setNodes((nodes) => [...nodes]);
    },
    [nodes]
  );

  useEffect(() => {
    async function prepareNodes() {
      const { nodes, simpleEdges } = await blueprintsToNodesAndEdges(
        blueprints
      );
      setNodes(nodes);
      setEdges(simpleEdges);
    }

    prepareNodes();
  }, [blueprints, setEdges]);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    onEdgesChange,
    setSearchPhrase,
    searchPhraseChanged,
    setSelectRelatedNodes,
    errorMessage,
  };
};

export default useBlueprintGraph;
