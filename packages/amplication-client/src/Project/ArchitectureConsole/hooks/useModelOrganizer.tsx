import { useLazyQuery, useMutation } from "@apollo/client";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/appContext";
import * as models from "../../../models";
import {
  CREATE_RESOURCE_ENTITIES,
  GET_RESOURCES,
} from "../queries/modelsQueries";
import { ModelChanges, Node } from "../types";
import { entitiesToNodesAndEdges, tempResourceToNode } from "../helpers";
import { Edge, useEdgesState } from "reactflow";
import { applyAutoLayout } from "../layout";
import useLocalStorage from "react-use-localstorage";

type TData = {
  resources: models.Resource[];
};

type modelChangesData = {
  projectId: string;
  modelGroupsResources: {
    tempId: string;
    name: string;
  }[];
  entitiesToCopy: {
    targetResourceId: string;
    entityId: string;
  }[];
};

const LOCAL_NODES_STORAGE_KEY = "ModelOrganizerNodesData";
const LOCAL_DETAILED_EDGES_STORAGE_KEY = "ModelOrganizerDetailedEdgesData";
const LOCAL_SIMPLE_EDGES_STORAGE_KEY = "ModelOrganizerSimpleEdgesData";

const useModelOrganization = () => {
  const { currentProject } = useContext(AppContext);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  // const [modelGroups, setModelGroups] = useState<ResourceNode[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]); // main data elements for save
  const [currentResourcesData, setCurrentResourcesData] = useState<
    models.Resource[]
  >([]);
  const [selectedNode, setSelectedNode] = useState<Node>(null);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [simpleEdges, setSimpleEdges] = useState<Edge[]>([]);

  const [detailedEdges, setDetailedEdges] = useState<Edge[]>([]);
  const [showRelationDetails, setShowRelationDetails] = useState(false);

  const [currentTheme, setCurrentTheme] = useLocalStorage(
    LOCAL_NODES_STORAGE_KEY,
    ""
  );

  const [currentDetailedEdges, setCurrentDetailedEdges] = useLocalStorage(
    LOCAL_DETAILED_EDGES_STORAGE_KEY,
    ""
  );

  const [currentSimpleEdges, setCurrentSimpleEdges] = useLocalStorage(
    LOCAL_SIMPLE_EDGES_STORAGE_KEY,
    ""
  );

  const [currentResourcesStorageData, setCurrentResourceStorageData] =
    useLocalStorage("currentResourceData", "");

  const [currentChangesStorageData, setCurrentChangesStorageData] =
    useLocalStorage("currentChangesData", "");

  const [changes, setChanges] = useState<ModelChanges>({
    movedEntities: [],
    newServices: [],
  });

  useEffect(() => {
    if (currentResourcesStorageData !== "") {
      const data: models.Resource[] = JSON.parse(currentResourcesStorageData);
      setCurrentResourcesData(data);
    }
  }, [currentResourcesStorageData, setCurrentResourcesData]);

  useEffect(() => {
    if (currentChangesStorageData !== "") {
      const data: ModelChanges = JSON.parse(currentChangesStorageData);
      setChanges(data);
    }
  }, [currentChangesStorageData, setChanges]);

  const [
    loadProjectResourcesInternal,
    { loading: loadingResources, error: resourcesError, data: resourcesData },
  ] = useLazyQuery<TData>(GET_RESOURCES, {
    variables: {
      projectId: currentProject?.id,
    },
    fetchPolicy: "no-cache",
  });

  const loadProjectResources = useCallback(
    (forceGetResources = false) => {
      if (currentTheme !== "" && !forceGetResources) {
        const nodesFromStorage: Node[] = JSON.parse(currentTheme);
        const edgesDetailedNodesFromStorage: Edge[] =
          JSON.parse(currentDetailedEdges);
        const edgesSimpleNodesFromStorage: Edge[] =
          JSON.parse(currentSimpleEdges);

        setNodes(nodesFromStorage);
        setDetailedEdges(edgesDetailedNodesFromStorage);
        setSimpleEdges(edgesSimpleNodesFromStorage);

        if (showRelationDetails) {
          setEdges(edgesDetailedNodesFromStorage);
        } else {
          setEdges(edgesSimpleNodesFromStorage);
        }
        return;
      }
      loadProjectResourcesInternal({
        variables: {
          projectId: currentProject?.id,
        },
        onCompleted: async (data) => {
          const { nodes, detailedEdges, simpleEdges } =
            await entitiesToNodesAndEdges(data.resources, showRelationDetails);

          setNodes(nodes);

          //set all nodes data in local storage
          setCurrentTheme(JSON.stringify(nodes));
          setCurrentDetailedEdges(JSON.stringify(detailedEdges));
          setCurrentSimpleEdges(JSON.stringify(simpleEdges));
          setCurrentResourceStorageData(JSON.stringify(data.resources));

          if (showRelationDetails) {
            setEdges(detailedEdges);
          } else {
            setEdges(simpleEdges);
          }
          setDetailedEdges(detailedEdges);
          setSimpleEdges(simpleEdges);
        },
      });
    },
    [
      loadProjectResourcesInternal,
      setCurrentResourceStorageData,
      showRelationDetails,
      currentDetailedEdges,
      currentSimpleEdges,
      currentProject,
      currentTheme,
      edges,
      simpleEdges,
      detailedEdges,
      setEdges,
      setNodes,
      setDetailedEdges,
      setSimpleEdges,
      setCurrentTheme,
      setCurrentDetailedEdges,
      setCurrentSimpleEdges,
    ]
  );

  const toggleShowRelationDetails = useCallback(async () => {
    const currentShowRelationDetails = !showRelationDetails;
    const currentEdges = currentShowRelationDetails
      ? detailedEdges
      : simpleEdges;

    setShowRelationDetails(currentShowRelationDetails);
    setEdges(currentEdges);

    const updatedNodes = await applyAutoLayout(
      nodes,
      currentEdges,
      currentShowRelationDetails
    );
    setNodes(updatedNodes);
  }, [
    showRelationDetails,
    simpleEdges,
    detailedEdges,
    nodes,
    setNodes,
    setEdges,
    setShowRelationDetails,
  ]);

  const resetChanges = useCallback(() => {
    setChanges({
      movedEntities: [],
      newServices: [],
    });
    setCurrentTheme("");
    setCurrentDetailedEdges("");
    setCurrentSimpleEdges("");
    setCurrentChangesStorageData("");
  }, [
    setChanges,
    setCurrentTheme,
    setCurrentDetailedEdges,
    setCurrentSimpleEdges,
    setCurrentChangesStorageData,
  ]);

  const searchPhraseChanged = useCallback(
    (searchPhrase: string) => {
      if (searchPhrase === "") {
        nodes.forEach((x) => (x.hidden = false));
      } else {
        const searchModelGroupNodes = nodes.filter(
          (node) =>
            node.type === "modelGroup" &&
            !node.data.payload.name.includes(searchPhrase) &&
            node.id !== selectedNode?.id
        );

        searchModelGroupNodes.forEach((x) => {
          x.hidden = true;
          const childrenNodes = nodes.filter(
            (node) => node.data.originalParentNode === x.id
          );

          childrenNodes.forEach((x) => (x.hidden = true));
        });
      }

      setNodes((nodes) => [...nodes]);
    },
    [nodes, setNodes]
  );

  const modelGroupFilterChanged = useCallback(
    (event: any, modelGroup: Node) => {
      const currentNode = nodes.find((node) => node.id === modelGroup.id);

      currentNode.hidden = !currentNode.hidden;

      const childrenNodes = nodes.filter(
        (node) => node.data.originalParentNode === currentNode.id
      );

      childrenNodes.forEach((x) => (x.hidden = currentNode.hidden));

      setNodes((nodes) => [...nodes]);
    },
    [setNodes, nodes]
  );

  const createNewTempService = useCallback(
    async (newResource: models.Resource) => {
      const newService = {
        tempId: newResource.tempId,
        name: newResource.name,
      };

      changes.newServices.push(newService);

      const newResourceNode = tempResourceToNode(newResource, nodes.length + 1);
      nodes.push(newResourceNode);

      const updatedNodes = await applyAutoLayout(
        nodes,
        edges,
        showRelationDetails
      );

      setChanges((changes) => changes);
      setNodes(updatedNodes);
      setCurrentTheme(JSON.stringify(updatedNodes));
      setCurrentChangesStorageData(JSON.stringify(changes));
    },
    [
      setChanges,
      setCurrentChangesStorageData,
      changes,
      nodes,
      setNodes,
      currentTheme,
      setCurrentTheme,
      showRelationDetails,
    ]
  );

  const resetToOriginalState = useCallback(() => {
    resetChanges();
    loadProjectResources();
  }, [loadProjectResources, resetChanges]);

  useEffect(() => {
    if (currentProject?.id) {
      if (currentTheme !== "") {
        loadProjectResources();
      } else {
        loadProjectResources(true);
      }
    }
  }, [currentProject, changes]);

  const moveNodeToParent = useCallback(
    (node: Node, targetParent: Node) => {
      const currentNode = nodes.find((n) => n.id === node.id);

      currentNode.parentNode = targetParent.id;

      const currentEntityChanged = changes.movedEntities.find(
        (x) => x.entityId === node.id
      );

      if (currentEntityChanged) {
        if (currentNode.data.originalParentNode === currentNode.parentNode) {
          //remove the change from the changes list
          changes.movedEntities = changes.movedEntities.filter(
            (x) => x.entityId !== currentEntityChanged.entityId
          );
        } else {
          currentEntityChanged.targetResourceId = targetParent.id;
        }
      } else {
        if (currentNode.data.originalParentNode !== currentNode.parentNode) {
          changes.movedEntities.push({
            entityId: currentNode.id,
            targetResourceId: targetParent.id,
          });
        }
      }

      const updatedNodes = [...nodes];
      const updatedChanges = changes;
      setChanges((changes) => changes);
      setNodes((nodes) => [...nodes]);
      setCurrentTheme(JSON.stringify(updatedNodes));
      setCurrentChangesStorageData(JSON.stringify(updatedChanges));
    },
    [
      setNodes,
      changes,
      setChanges,
      nodes,
      setCurrentTheme,
      setCurrentChangesStorageData,
    ]
  );

  const [
    createResourceEntities,
    { loading: loadingCreateEntities, error: createEntitiesError },
  ] = useMutation<modelChangesData>(CREATE_RESOURCE_ENTITIES, {});

  const saveChanges = useCallback(async () => {
    await createResourceEntities({
      variables: {
        data: {
          entitiesToCopy: changes.movedEntities,
          modelGroupsResources: changes.newServices,
          projectId: currentProject.id,
        },
      },
    }).catch(console.error);

    resetChanges();
    loadProjectResources(true);
  }, [resetChanges, changes]);

  return {
    nodes,
    currentResourcesData,
    setNodes,
    selectedNode,
    setSelectedNode,
    edges,
    setEdges,
    onEdgesChange,
    showRelationDetails,
    resourcesData,
    loadingResources,
    resourcesError,
    setSearchPhrase,
    toggleShowRelationDetails,
    resetToOriginalState,
    changes,
    setChanges,
    saveChanges,
    moveNodeToParent,
    createNewTempService,
    modelGroupFilterChanged,
    searchPhraseChanged,
  };
};

export default useModelOrganization;
