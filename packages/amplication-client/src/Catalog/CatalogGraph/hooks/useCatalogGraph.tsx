import { useCallback, useEffect, useState } from "react";
import { useEdgesState } from "reactflow";
import { Node, NODE_TYPE_RESOURCE } from "../types";

import { EnumMessageType } from "../../../util/useMessage";
import useCatalog from "../../hooks/useCatalog";
import { resourcesToNodesAndEdges } from "../helpers";

type Props = {
  onMessage: (message: string, type: EnumMessageType) => void;
};

const useCatalogGraph = ({ onMessage }: Props) => {
  const { catalog, setFilter } = useCatalog({ initialPageSize: 1000 });

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [nodes, setNodes] = useState<Node[]>([]); // main data elements for save

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [errorMessage, setErrorMessage] = useState<string>(null);
  const [showDisconnectedResources, setShowDisconnectedResources] =
    useState(false);

  const setSelectRelatedNodes = useCallback(
    (node: Node) => {
      if (node.type !== NODE_TYPE_RESOURCE) return;

      const relations = node.data.payload.relations;

      const relatedNodeIds = relations.flatMap((relation) => {
        return relation.relatedResources;
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
      const connectedResources = catalog.reduce((acc, curr) => {
        const connected = curr.relations?.flatMap((relation) => {
          return relation.relatedResources;
        });

        if (connected && connected.length > 0) {
          acc[curr.id] = true;
          connected.forEach((id) => {
            acc[id] = true;
          });
        }
        return acc;
      }, {});

      const filteredCatalog = showDisconnectedResources
        ? catalog.filter((resource) => {
            return connectedResources[resource.id];
          })
        : catalog;

      const { nodes, simpleEdges } = await resourcesToNodesAndEdges(
        filteredCatalog
      );
      setNodes(nodes);
      setEdges(simpleEdges);
    }

    prepareNodes();
  }, [catalog, setEdges, showDisconnectedResources]);

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
    setFilter,
    showDisconnectedResources,
    setShowDisconnectedResources,
  };
};

export default useCatalogGraph;
