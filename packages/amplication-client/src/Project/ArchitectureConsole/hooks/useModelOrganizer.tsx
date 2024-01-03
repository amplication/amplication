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

const LOCAL_STORAGE_KEY = "ModelOrganizerData";

const useModelOrganization = () => {
  const { currentProject } = useContext(AppContext);
  const [searchPhrase, setSearchPhrase] = useState<string>("");
  // const [modelGroups, setModelGroups] = useState<ResourceNode[]>([]);
  const [nodes, setNodes] = useState<Node[]>([]); // main data elements for save
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [simpleEdges, setSimpleEdges] = useState<Edge[]>([]);
  const [detailedEdges, setDetailedEdges] = useState<Edge[]>([]);
  const [showRelationDetails, setShowRelationDetails] = useState(false);

  const [currentTheme, setCurrentTheme] = useLocalStorage(
    LOCAL_STORAGE_KEY,
    ""
  );

  const [changes, setChanges] = useState<ModelChanges>({
    movedEntities: [],
    newServices: [],
  });

  const [
    loadProjectResourcesInternal,
    { loading: loadingResources, error: resourcesError, data: resourcesData },
  ] = useLazyQuery<TData>(GET_RESOURCES, {
    variables: {
      projectId: currentProject?.id,
    },
    fetchPolicy: "no-cache",
  });

  const loadProjectResources = useCallback(() => {
    loadProjectResourcesInternal({
      variables: {
        projectId: currentProject?.id,
      },
      onCompleted: async (data) => {
        const { nodes, detailedEdges, simpleEdges } =
          await entitiesToNodesAndEdges(data.resources, showRelationDetails);

        setNodes(nodes);
        if (showRelationDetails) {
          setEdges(detailedEdges);
        } else {
          setEdges(simpleEdges);
        }
        setDetailedEdges(detailedEdges);
        setSimpleEdges(simpleEdges);
      },
    });
  }, [loadProjectResourcesInternal, showRelationDetails, currentProject]);

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
  }, [setChanges]);

  const searchPhraseChanged = useCallback(
    (searchPhrase: string) => {
      if (searchPhrase === "") {
        nodes.forEach((x) => (x.hidden = false));
      } else {
        const searchModelGroupNodes = nodes.filter(
          (node) =>
            node.type === "modelGroup" &&
            !node.data.payload.name.includes(searchPhrase)
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
    },
    [setChanges, changes, nodes, setNodes, showRelationDetails]
  );

  const resetToOriginalState = useCallback(() => {
    resetChanges();
    loadProjectResources();
  }, [loadProjectResources, resetChanges]);

  useEffect(() => {
    if (currentProject?.id) {
      loadProjectResources();
    }
  }, [currentProject]);

  const moveNodeToParent = useCallback(
    (node: Node, targetParent: Node) => {
      node.parentNode = targetParent.id;

      const currentEntityChanged = changes.movedEntities.find(
        (x) => x.entityId === node.id
      );

      if (currentEntityChanged) {
        if (node.data.originalParentNode === node.parentNode) {
          //remove the change from the changes list
          changes.movedEntities = changes.movedEntities.filter(
            (x) => x.entityId !== currentEntityChanged.entityId
          );
        } else {
          currentEntityChanged.targetResourceId = targetParent.id;
        }
      } else {
        if (node.data.originalParentNode !== node.parentNode) {
          changes.movedEntities.push({
            entityId: node.id,
            targetResourceId: targetParent.id,
          });
        }
      }

      setChanges((changes) => changes);
      setNodes((nodes) => [...nodes]);
    },
    [setNodes, changes, setChanges, nodes]
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
    loadProjectResources();
  }, [resetChanges, changes]);

  return {
    nodes,
    setNodes,
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
