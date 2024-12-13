import { useCallback, useEffect, useState } from "react";
import { useEdgesState } from "reactflow";
import { GroupByField, Node, NODE_TYPE_RESOURCE, WindowSize } from "../types";

import { EnumMessageType } from "../../../util/useMessage";
import useCatalog from "../../hooks/useCatalog";
import { removeUnusedRelations, resourcesToNodesAndEdges } from "../helpers";
import { useAppContext } from "../../../context/appContext";

type Props = {
  onMessage: (message: string, type: EnumMessageType) => void;
};

const useCatalogGraph = ({ onMessage }: Props) => {
  const { catalog, setFilter, setSearchPhrase } = useCatalog({
    initialPageSize: 1000,
  });

  const {
    blueprintsMap: { blueprintsMapById, ready: blueprintsReady },
  } = useAppContext();

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 1600,
    height: 900,
  });

  const [groupByFields, setGroupByFields] = useState<GroupByField[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]); // main data elements for save

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [errorMessage, setErrorMessage] = useState<string>(null);

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

  useEffect(() => {
    async function prepareNodes() {
      if (!blueprintsReady) {
        //do not load data until the blueprints are ready
        return;
      }

      const sanitizedCatalog = removeUnusedRelations(
        catalog,
        blueprintsMapById
      );

      // console.log("groups", groups);

      const { nodes, simpleEdges } = await resourcesToNodesAndEdges(
        sanitizedCatalog,
        groupByFields,
        blueprintsMapById,
        windowSize
      );
      setNodes(nodes);
      setEdges(simpleEdges);
    }

    prepareNodes();
  }, [blueprintsMapById, catalog, setEdges, blueprintsReady, groupByFields]);

  return {
    nodes,
    setNodes,
    edges,
    setEdges,
    onEdgesChange,
    setSearchPhrase,
    setSelectRelatedNodes,
    errorMessage,
    setFilter,
    setGroupByFields,
    groupByFields,
    setWindowSize,
  };
};

export default useCatalogGraph;
