import { useCallback, useEffect, useState } from "react";
import { useEdgesState } from "reactflow";
import {
  GroupByField,
  LayoutOptions,
  Node,
  NODE_TYPE_RESOURCE,
} from "../types";

import { EnumMessageType } from "../../../util/useMessage";
import useCatalog from "../../hooks/useCatalog";
import { removeUnusedRelations, resourcesToNodesAndEdges } from "../helpers";
import { useAppContext } from "../../../context/appContext";
import useLocalStorageData from "../../../util/useLocalStorageData";

type GraphPersistedData = {
  layoutOptions: LayoutOptions;
  groupByFields: GroupByField[];
};

type Props = {
  onMessage: (message: string, type: EnumMessageType) => void;
};

const LOCAL_STORAGE_KEY = "catalogGraphLayout";

const useCatalogGraph = ({ onMessage }: Props) => {
  const [layoutOptions, setLayoutOptions] = useState<LayoutOptions>({
    nodeSpacing: 250,
    layersSpacing: 250,
    layersDirection: "RIGHT",
    windowSize: { width: 1600, height: 900 },
  });

  const { currentWorkspace } = useAppContext();

  const storageKey = `${LOCAL_STORAGE_KEY}-${currentWorkspace?.id}`;

  const { persistData, loadPersistentData, clearPersistentData } =
    useLocalStorageData<GraphPersistedData>(storageKey);

  const { catalog, setFilter, setSearchPhrase, reloadCatalog } = useCatalog({
    initialPageSize: 1000,
  });

  const {
    blueprintsMap: { blueprintsMapById, ready: blueprintsReady },
  } = useAppContext();

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

  const setPartialLayoutOptions = useCallback(
    (partialLayoutOptions: LayoutOptions) => {
      setLayoutOptions((prev) => {
        return {
          ...prev,
          ...partialLayoutOptions,
        };
      });
    },
    []
  );

  const saveState = useCallback(() => {
    persistData({ layoutOptions, groupByFields });
    onMessage && onMessage("State saved", EnumMessageType.Success);
  }, [groupByFields, layoutOptions, onMessage, persistData]);

  useEffect(() => {
    const persistedData = loadPersistentData();
    if (persistedData) {
      setLayoutOptions(persistedData.layoutOptions || layoutOptions);
      setGroupByFields(persistedData.groupByFields || []);
    }
  }, []);

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

      const { nodes, simpleEdges } = await resourcesToNodesAndEdges(
        sanitizedCatalog,
        groupByFields,
        blueprintsMapById,
        layoutOptions
      );
      setNodes(nodes);
      setEdges(simpleEdges);
    }

    prepareNodes();
  }, [
    blueprintsMapById,
    catalog,
    setEdges,
    blueprintsReady,
    groupByFields,
    layoutOptions,
  ]);

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
    setPartialLayoutOptions,
    layoutOptions,
    saveState,
    reloadCatalog,
  };
};

export default useCatalogGraph;
