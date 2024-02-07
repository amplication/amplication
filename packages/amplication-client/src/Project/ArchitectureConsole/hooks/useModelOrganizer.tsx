import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { useEdgesState } from "reactflow";
import * as models from "../../../models";
import {
  entitiesToNodesAndEdges,
  nodesToDetailedEdges,
  nodesToSimpleEdges,
  tempResourceToNode,
} from "../helpers";
import { applyAutoLayout } from "../layout";
import {
  REDESIGN_PROJECT,
  GET_RESOURCES,
  START_REDESIGN,
} from "../queries/modelsQueries";
import {
  EntityNode,
  ModelChanges,
  ModelOrganizerPersistentData,
  NODE_TYPE_MODEL_GROUP,
  Node,
  ResourceNode,
} from "../types";

import useModelOrganizerPersistentData from "./useModelOrganizerPersistentData";
import { EnumMessageType } from "../../../util/useMessage";
import useUserActionWatchStatus from "../../../UserAction/useUserActionWatchStatus";
import { useAppContext } from "../../../context/appContext";
import { useTracking } from "../../../util/analytics";
import { AnalyticsEventNames } from "../../../util/analytics-events.types";

type TData = {
  resources: models.Resource[];
};

type TDataStartRedesign = {
  startRedesign: {
    data: models.Resource;
  };
};

type Props = {
  projectId: string;
  onMessage: (message: string, type: EnumMessageType) => void;
};

type RedesignProjectData = {
  redesignProject: models.UserAction;
};

const useModelOrganization = ({ projectId, onMessage }: Props) => {
  const { trackEvent } = useTracking();
  const { reloadResources } = useAppContext();

  const [searchPhrase, setSearchPhrase] = useState<string>("");
  const [nodes, setNodes] = useState<Node[]>([]); // main data elements for save
  const [currentResourcesData, setCurrentResourcesData] = useState<
    models.Resource[]
  >([]);
  const [currentEditableResourceNode, setCurrentEditableResourceNode] =
    useState<ResourceNode>(null);

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showRelationDetails, setShowRelationDetails] = useState(false);
  const [currentDetailedEdges, setCurrentDetailedEdges] = useEdgesState([]);
  const [currentSimpleEdges, setCurrentSimpleEdges] = useEdgesState([]);
  const [saveDataTimestampTrigger, setSaveDataTimestampTrigger] =
    useState<Date>(null);

  const [redesignMode, setRedesignMode] = useState<boolean>(false);

  const [userAction, setUserAction] = useState<models.UserAction>(null);
  const { data: applyChangesResults } = useUserActionWatchStatus(userAction);

  const [changes, setChanges] = useState<ModelChanges>({
    movedEntities: [],
    newServices: [],
  });

  const { persistData, loadPersistentData, clearPersistentData } =
    useModelOrganizerPersistentData(projectId);

  const [startRedesign] = useMutation<TDataStartRedesign>(START_REDESIGN);

  useEffect(() => {
    if (saveDataTimestampTrigger === null) return;

    const savedData: ModelOrganizerPersistentData = {
      projectId: projectId,
      nodes: nodes,
      changes: changes,
      showRelationDetails: showRelationDetails,
      redesignMode: redesignMode,
    };

    persistData(savedData);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveDataTimestampTrigger]);

  const saveToPersistentData = useCallback(() => {
    //update the timestamp to trigger the useEffect
    setSaveDataTimestampTrigger(new Date());
  }, [setSaveDataTimestampTrigger]);

  const [
    loadProjectResourcesInternal,
    { loading: loadingResources, error: resourcesError, data: resourcesData },
  ] = useLazyQuery<TData>(GET_RESOURCES, {
    variables: {
      projectId: projectId,
    },
    fetchPolicy: "no-cache",
  });

  const loadProjectResources = useCallback(
    (forceRefresh?: boolean, onLoadResourcesCompleted?: () => void) => {
      if (!forceRefresh) {
        //try to load a saved copy of the data from the persistent layer
        const savedData = loadPersistentData();

        if (savedData && savedData.redesignMode) {
          setNodes(savedData.nodes);
          setShowRelationDetails(savedData.showRelationDetails);
          const simpleEdges = nodesToSimpleEdges(savedData.nodes);
          setCurrentSimpleEdges(simpleEdges);
          const detailedEdges = nodesToDetailedEdges(savedData.nodes);
          setCurrentDetailedEdges(detailedEdges);
          setEdges(savedData.showRelationDetails ? detailedEdges : simpleEdges);
          setChanges(savedData.changes);
          setRedesignMode(savedData.redesignMode);

          const resources = savedData.nodes.reduce((resources, node) => {
            if (node.type === NODE_TYPE_MODEL_GROUP) {
              if (node.data.isEditable) {
                setCurrentEditableResourceNode(node);
              }
              resources.push(node.data.payload);
            }
            return resources;
          }, []);

          setCurrentResourcesData(resources);
          onLoadResourcesCompleted && onLoadResourcesCompleted();
          return;
        }
      }

      //load fresh copy of the data from the server
      loadProjectResourcesInternal({
        variables: {
          projectId: projectId,
        },
        onCompleted: async (data) => {
          const { nodes, detailedEdges, simpleEdges } =
            await entitiesToNodesAndEdges(data.resources, showRelationDetails);
          setCurrentResourcesData(data.resources);
          setCurrentDetailedEdges(detailedEdges);
          setCurrentSimpleEdges(simpleEdges);

          setNodes(nodes);

          if (showRelationDetails) {
            setEdges(detailedEdges);
          } else {
            setEdges(simpleEdges);
          }

          saveToPersistentData();
          onLoadResourcesCompleted && onLoadResourcesCompleted();
        },
      });
    },
    [
      loadPersistentData,
      loadProjectResourcesInternal,
      projectId,
      setCurrentDetailedEdges,
      setCurrentSimpleEdges,
      showRelationDetails,
      saveToPersistentData,
      setEdges,
    ]
  );

  const toggleShowRelationDetails = useCallback(async () => {
    const currentShowRelationDetails = !showRelationDetails;
    const currentEdges = currentShowRelationDetails
      ? currentDetailedEdges
      : currentSimpleEdges;

    setShowRelationDetails(currentShowRelationDetails);

    setEdges(currentEdges);

    const updatedNodes = await applyAutoLayout(
      nodes,
      currentEdges,
      currentShowRelationDetails
    );
    setNodes(updatedNodes);
    saveToPersistentData();
  }, [
    showRelationDetails,
    currentDetailedEdges,
    currentSimpleEdges,
    setEdges,
    nodes,
    saveToPersistentData,
  ]);

  const resetChanges = useCallback(
    (showResetMessage = true) => {
      setChanges({
        movedEntities: [],
        newServices: [],
      });
      if (currentEditableResourceNode) {
        currentEditableResourceNode.data.isEditable = false;
      }
      setCurrentEditableResourceNode(null);
      setRedesignMode(false);

      clearPersistentData();
      loadProjectResources(
        true,
        showResetMessage
          ? () => {
              onMessage(
                "Redesign changes were discarded successfully",
                EnumMessageType.Success
              );
            }
          : undefined
      );
    },
    [
      currentEditableResourceNode,
      clearPersistentData,
      loadProjectResources,
      onMessage,
    ]
  );

  const createNewServiceObject = useCallback(
    (serviceName: string, serviceTempId: string) => {
      const newService: models.Resource = {
        description: "",
        entities: [],
        id: serviceTempId,
        name: serviceName,
        resourceType: models.EnumResourceType.Service,
        builds: [],
        createdAt: undefined,
        environments: [],
        gitRepositoryOverride: false,
        licensed: false,
        updatedAt: undefined,
      };

      return newService;
    },
    []
  );

  //return an array with two element - the list of updates nodes and the selected resource node
  const prepareCurrentEditableResourceNodesData = useCallback(
    (nodes: Node[], resource: models.Resource) => {
      let selectedResourceNode: ResourceNode;
      nodes.forEach((node) => {
        if (node.data.originalParentNode === resource.id) {
          node.draggable = true;
          node.selectable = true;
        }
        if (node.id === resource.id) {
          selectedResourceNode = node as ResourceNode;
          selectedResourceNode.data.isEditable = true;
        }
      });

      return { updatedNodes: [...nodes], selectedResourceNode };
    },
    []
  );

  const setCurrentEditableResource = useCallback(
    (resource: models.Resource) => {
      setNodes((nodes) => {
        const { updatedNodes, selectedResourceNode } =
          prepareCurrentEditableResourceNodesData(nodes, resource);

        setCurrentEditableResourceNode(selectedResourceNode);

        setRedesignMode(true);
        setUserAction(null); //clear results of previous apply if exists
        saveToPersistentData();

        startRedesign({
          variables: {
            data: {
              id: resource.id,
            },
          },
        }).catch(console.error);

        return [...updatedNodes];
      });
      onMessage(
        `You can start breaking ${resource.name}, and drag entities to other services`,
        EnumMessageType.Success
      );
    },
    [
      prepareCurrentEditableResourceNodesData,
      startRedesign,
      saveToPersistentData,
      onMessage,
    ]
  );

  const mergeNewResourcesChanges = useCallback(() => {
    loadProjectResourcesInternal({
      variables: {
        projectId: projectId,
      },
      onCompleted: async (data) => {
        if (data?.resources) {
          //add the new services into the list of resources returned from the server
          for (const newServiceChange of changes.newServices) {
            //check if the service name already exists in the list of resources
            const newExistingServiceWithSameName = data.resources.find(
              (x) => x.name === newServiceChange.name
            );

            const serviceName = newExistingServiceWithSameName
              ? newServiceChange.name + "_" + newServiceChange.id
              : newServiceChange.name;

            newServiceChange.name = serviceName;

            const newResource = createNewServiceObject(
              serviceName,
              newServiceChange.id
            );
            data.resources.push(newResource);
          }

          const resourceMapping = data.resources.reduce(
            (resourcesObj, resource) => {
              resourcesObj[resource.id] = resource;
              return resourcesObj;
            },
            {}
          );

          const newMovedEntities: models.RedesignProjectMovedEntity[] = [];

          for (const movedEntity of changes.movedEntities) {
            if (!resourceMapping[movedEntity.originalResourceId]) {
              //do not take this change because the original resource was deleted
              continue;
            }
            if (!resourceMapping[movedEntity.targetResourceId]) {
              continue;
              //do not take this change because the target resource was deleted
            }
            newMovedEntities.push(movedEntity);
          }

          const {
            nodes: newNodes,
            detailedEdges: newDetailedEdges,
            simpleEdges: newSimpleEdges,
          } = await entitiesToNodesAndEdges(
            data.resources,
            showRelationDetails
          );

          for (const newMovedEntitiesChange of newMovedEntities) {
            const movedNode = newNodes.find(
              (x) => x.id === newMovedEntitiesChange.entityId
            );
            movedNode.parentNode = newMovedEntitiesChange.targetResourceId;
          }

          //find the current editable resource and update the nodes
          const currentEditableResource = data.resources.find(
            (x) => x.id === currentEditableResourceNode.id
          );
          const { updatedNodes, selectedResourceNode } =
            prepareCurrentEditableResourceNodesData(
              newNodes,
              currentEditableResource
            );
          setCurrentEditableResourceNode(selectedResourceNode);

          setCurrentResourcesData(data.resources);

          setCurrentDetailedEdges(newDetailedEdges);
          setCurrentSimpleEdges(newSimpleEdges);

          const updatedNodesWithLayout = await applyAutoLayout(
            updatedNodes,
            newSimpleEdges,
            showRelationDetails
          );

          setNodes(updatedNodesWithLayout);
          setChanges({
            movedEntities: newMovedEntities,
            newServices: changes.newServices,
          });

          if (showRelationDetails) {
            setEdges(newDetailedEdges);
          } else {
            setEdges(newSimpleEdges);
          }
          saveToPersistentData();
          onMessage(
            "Updates fetched from the server and applied successfully",
            EnumMessageType.Success
          );
        }
      },
    });
  }, [
    loadProjectResourcesInternal,
    projectId,
    showRelationDetails,
    prepareCurrentEditableResourceNodesData,
    setCurrentDetailedEdges,
    setCurrentSimpleEdges,
    changes.newServices,
    changes.movedEntities,
    saveToPersistentData,
    createNewServiceObject,
    currentEditableResourceNode,
    setEdges,
    onMessage,
  ]);

  const searchPhraseChanged = useCallback(
    (searchPhrase: string) => {
      if (searchPhrase === "") {
        nodes.forEach((x) => (x.hidden = false));
        edges.forEach((e) => (e.hidden = false));
      } else {
        const searchModelGroupNodes = nodes.filter(
          (node) =>
            node.type === "modelGroup" &&
            !node.data.payload.name.includes(searchPhrase) &&
            node.id !== currentEditableResourceNode?.id
        );

        searchModelGroupNodes.forEach((x) => {
          x.hidden = true;
          const childrenNodes = nodes.filter(
            (node: EntityNode) => node.parentNode === x.id
          );

          childrenNodes.forEach((x) => (x.hidden = true));

          const nodeEdges = edges.filter((e) => {
            return childrenNodes.find((n) => e.source === n.id);
          });

          nodeEdges.forEach((x) => (x.hidden = true));
        });
      }

      setNodes((nodes) => [...nodes]);
      setEdges((edges) => [...edges]);
    },
    [setEdges, nodes, edges, currentEditableResourceNode?.id]
  );

  const modelGroupFilterChanged = useCallback(
    (event: any, modelGroup: Node) => {
      const currentNode = nodes.find((node) => node.id === modelGroup.id);

      currentNode.hidden = !currentNode.hidden;

      const childrenNodes = nodes.filter(
        (node) => node.parentNode === currentNode.id
      );

      childrenNodes.forEach((x) => (x.hidden = currentNode.hidden));
      setNodes((nodes) => [...nodes]);

      const nodeEdges = edges.filter((e) => {
        return childrenNodes.find(
          (n) => e.source === n.id || e.target === n.id
        );
      });

      nodeEdges.forEach((x) => (x.hidden = currentNode.hidden));
      setEdges((edges) => [...edges]);
    },
    [setNodes, setEdges, edges, nodes]
  );

  const createNewTempService = useCallback(
    async (newResource: models.Resource) => {
      const currentIndex =
        nodes.filter((x) => x.type === "modelGroup").length + 1;
      const newResourceNode = tempResourceToNode(newResource, currentIndex);
      nodes.push(newResourceNode);

      const newService = {
        id: newResource.id,
        name: newResource.name,
      };

      changes.newServices.push(newService);
      const resourceDataCopy = [...currentResourcesData];
      resourceDataCopy.push(newResource);
      setCurrentResourcesData(resourceDataCopy);

      const updatedNodes = await applyAutoLayout(
        nodes,
        edges,
        showRelationDetails
      );

      setChanges((changes) => changes);
      setNodes(updatedNodes);
      setChanges(changes);
      saveToPersistentData();
    },
    [
      nodes,
      changes,
      currentResourcesData,
      edges,
      showRelationDetails,
      saveToPersistentData,
    ]
  );

  const moveNodeToParent = useCallback(
    async (movedNodes: Node[], targetParent: Node) => {
      const currentNodes = [...nodes];

      let newMovedEntities = [...changes.movedEntities];
      const sourceParentNodeId = movedNodes.length && movedNodes[0].parentNode;
      const sourceServiceName = nodes.find(
        (node) => node.id === sourceParentNodeId
      ).data.payload.name;

      movedNodes.forEach((node) => {
        const currentNode = currentNodes.find((n) => n.id === node.id);

        currentNode.parentNode = targetParent.id;

        newMovedEntities = newMovedEntities.filter(
          (x) => x.entityId !== node.id
        );

        if (currentNode.data.originalParentNode !== currentNode.parentNode) {
          newMovedEntities.push({
            entityId: currentNode.id,
            targetResourceId: targetParent.id,
            originalResourceId: currentNode.data.originalParentNode,
          });
        }
      });

      const updatedNodes = await applyAutoLayout(
        currentNodes,
        edges,
        showRelationDetails
      );

      setNodes(updatedNodes);

      setChanges({
        movedEntities: [...newMovedEntities],
        newServices: [...changes.newServices],
      });
      saveToPersistentData();

      trackEvent({
        eventName: AnalyticsEventNames.ModelOrganizer_MoveEntity,
        serviceName: sourceServiceName,
      });
    },
    [nodes, edges, showRelationDetails, changes, saveToPersistentData]
  );

  const [
    redesignProject,
    { loading: applyChangesLoading, error: applyChangesError },
  ] = useMutation<RedesignProjectData>(REDESIGN_PROJECT, {});

  const applyChanges = useCallback(async () => {
    await redesignProject({
      variables: {
        data: {
          ...changes,
          projectId: projectId,
        },
      },
      onCompleted: async (data) => {
        setUserAction(data.redesignProject);
        reloadResources();
        resetChanges(false);
      },
      onError: (error) => {
        //@todo: show Errors
      },
    }).catch(console.error);
  }, [changes, redesignProject, projectId, resetChanges]);

  useEffect(() => {
    if (projectId) {
      loadProjectResources();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  return {
    nodes,
    currentResourcesData,
    setNodes,
    edges,
    setEdges,
    onEdgesChange,
    showRelationDetails,
    resourcesData,
    loadingResources,
    resourcesError,
    applyChangesLoading,
    applyChangesError,
    applyChangesData: applyChangesResults?.userAction,
    setSearchPhrase,
    toggleShowRelationDetails,
    resetChanges,
    changes,
    setChanges,
    setCurrentEditableResource,
    applyChanges,
    moveNodeToParent,
    createNewTempService,
    modelGroupFilterChanged,
    searchPhraseChanged,
    mergeNewResourcesChanges,
    redesignMode,
  };
};

export default useModelOrganization;
