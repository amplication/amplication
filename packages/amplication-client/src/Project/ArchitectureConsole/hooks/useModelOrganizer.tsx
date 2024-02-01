import { useLazyQuery, useMutation } from "@apollo/client";
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
  CREATE_RESOURCE_ENTITIES,
  GET_RESOURCES,
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

const useModelOrganization = (projectId: string) => {
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

  const [changes, setChanges] = useState<ModelChanges>({
    movedEntities: [],
    newServices: [],
  });

  const { persistData, loadPersistentData, clearPersistentData } =
    useModelOrganizerPersistentData(projectId);

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
    (forceRefresh?: boolean) => {
      if (!forceRefresh) {
        //try to load a saved copy of the data from the persistent layer
        const savedData = loadPersistentData();

        if (savedData && savedData.redesignMode) {
          setNodes(savedData.nodes);
          setCurrentDetailedEdges(nodesToDetailedEdges(savedData.nodes));
          setCurrentSimpleEdges(nodesToSimpleEdges(savedData.nodes));
          setChanges(savedData.changes);
          setShowRelationDetails(savedData.showRelationDetails);
          setRedesignMode(savedData.redesignMode);
          if (savedData.showRelationDetails) {
            setEdges(nodesToDetailedEdges(savedData?.nodes));
          } else {
            setEdges(nodesToSimpleEdges(savedData?.nodes));
          }

          const resources = savedData.nodes.reduce((resources, node) => {
            if (node.type === NODE_TYPE_MODEL_GROUP) {
              resources.push(node.data.payload);
            }
            return resources;
          }, []);

          setCurrentResourcesData(resources);
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
      nodes,
      saveToPersistentData,
      setEdges,
      nodesToDetailedEdges,
      nodesToSimpleEdges,
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

  const resetChanges = useCallback(() => {
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
    loadProjectResources(true);
  }, [currentEditableResourceNode, clearPersistentData, loadProjectResources]);

  const mergeNewResourcesChanges = useCallback(() => {
    loadProjectResourcesInternal({
      variables: {
        projectId: projectId,
      },
      onCompleted: async (data) => {
        if (data?.resources) {
          const resourceMapping = currentResourcesData.reduce(
            (resourcesObj, resource) => {
              resourcesObj[resource.id] = resource;
              return resourcesObj;
            },
            {}
          );

          const updatedResourceMapping = data.resources.reduce(
            (resourcesObj, resource) => {
              resourcesObj[resource.id] = resource;
              return resourcesObj;
            },
            {}
          );

          let updatedResourcesData = currentResourcesData;

          let hasChanges = false;

          data.resources.forEach((updateResource) => {
            const currentResource = resourceMapping[updateResource.id];
            if (!currentResource) {
              updatedResourcesData.push(updateResource);
              hasChanges = true;
              return;
            }

            const currentEntityMapping = currentResource.entities?.reduce(
              (entitiesObj, entity) => {
                entitiesObj[entity.id] = entity;
                return entitiesObj;
              },
              {}
            );
            updateResource.entities?.forEach((e) => {
              const currentEntity = currentEntityMapping[e.id];
              const movedEntity = changes.movedEntities.find(
                (x) => x.entityId === e.id
              );

              if (!currentEntity && !movedEntity) {
                currentResource.entities?.push(e);
                hasChanges = true;
              }
            });
          });

          currentResourcesData.forEach((resource) => {
            const currentResource: models.Resource =
              updatedResourceMapping[resource.id];
            if (!currentResource) {
              let originalResource: models.Resource = null;
              let originalResourceIndex: number;

              changes?.movedEntities?.forEach((e) => {
                if (e.targetResourceId === resource.id) {
                  const index = changes.movedEntities.indexOf(e);
                  changes.movedEntities.splice(index, 1);
                }
                if (!originalResource) {
                  originalResource =
                    updatedResourceMapping[e.originalResourceId];
                } else {
                  originalResourceIndex = updatedResourcesData.indexOf(
                    resourceMapping[originalResource.id]
                  );
                }
              });

              if (originalResource) {
                resource.entities.forEach((e) => {
                  if (e.resourceId === originalResource.id) {
                    resourceMapping[originalResource.id].entities.push(e);
                  }
                });

                updatedResourcesData[originalResourceIndex] =
                  resourceMapping[originalResource.id];
              }

              updatedResourcesData = updatedResourcesData.filter(
                (r) => r.id !== resource.id
              );

              hasChanges = true;
            } else {
              const updatedEntityMapping = currentResource.entities?.reduce(
                (entitiesObj, entity) => {
                  entitiesObj[entity.id] = entity;
                  return entitiesObj;
                },
                {}
              );

              const currentResourceEntities = updatedResourcesData.find(
                (x) => x.id === resource.id
              );

              resource.entities?.forEach((entity) => {
                const currentEntity: models.Entity =
                  updatedEntityMapping[entity.id];
                const movedEntity = changes.movedEntities.find(
                  (x) => x.entityId === entity.id
                );

                if (!currentEntity) {
                  if (!movedEntity) {
                    currentResourceEntities.entities = resource.entities.filter(
                      (e) => e.id !== entity.id
                    );
                    hasChanges = true;
                  } else {
                    const originalResourceEntity = data.resources
                      .find((x) => x.id === movedEntity.originalResourceId)
                      ?.entities?.find((e) => e.id === movedEntity.entityId);

                    if (!originalResourceEntity) {
                      hasChanges = true;
                      currentResourceEntities.entities =
                        resource.entities.filter(
                          (e) => e.id !== movedEntity.entityId
                        );
                      changes.movedEntities = changes.movedEntities.filter(
                        (x) => x.entityId !== movedEntity.entityId
                      );
                    }
                  }
                }
              });
            }
          });

          if (hasChanges) {
            const { nodes, detailedEdges, simpleEdges } =
              await entitiesToNodesAndEdges(
                updatedResourcesData,
                showRelationDetails
              );
            setCurrentResourcesData(updatedResourcesData);

            setCurrentDetailedEdges(detailedEdges);
            setCurrentSimpleEdges(simpleEdges);

            setNodes(nodes);
            setChanges(changes);

            if (showRelationDetails) {
              setEdges(detailedEdges);
            } else {
              setEdges(simpleEdges);
            }
            saveToPersistentData();
          }
        }
      },
    });
  }, [
    loadProjectResourcesInternal,
    projectId,
    currentResourcesData,
    changes,
    showRelationDetails,
    setCurrentDetailedEdges,
    setCurrentSimpleEdges,
    saveToPersistentData,
    setEdges,
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
        (node) => node.data.originalParentNode === currentNode.id
      );

      childrenNodes.forEach((x) => (x.hidden = currentNode.hidden));
      setNodes((nodes) => [...nodes]);

      const nodeEdges = edges.filter((e) => {
        return childrenNodes.find((n) => e.source === n.id);
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
        tempId: newResource.tempId,
        name: newResource.name,
        color: newResourceNode.data.groupColor,
      };

      changes.newServices.push(newService);
      const resourceDataCopy = currentResourcesData;
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

  const setCurrentEditableResource = useCallback(
    (resource: models.Resource) => {
      setNodes((nodes) => {
        nodes.forEach((node) => {
          if (node.data.originalParentNode === resource.id) {
            node.draggable = true;
            node.selectable = true;
          }
          if (node.id === resource.id) {
            const selectedResourceNode: ResourceNode = node as ResourceNode;
            selectedResourceNode.data.isEditable = true;
            setCurrentEditableResourceNode(selectedResourceNode);
          }
        });
        setRedesignMode(true);
        saveToPersistentData();
        return [...nodes];
      });
    },
    [setNodes, setCurrentEditableResourceNode, saveToPersistentData]
  );

  const moveNodeToParent = useCallback(
    async (movedNodes: Node[], targetParent: Node) => {
      movedNodes.forEach((node) => {
        const currentNode = nodes.find((n) => n.id === node.id);
        const originalResource = currentResourcesData.find(
          (x) => x.id === currentNode.data.originalParentNode
        );

        const targetResource = currentResourcesData.find(
          (x) => x.id === targetParent.id
        );

        const currentEntity = currentNode.data.payload as models.Entity;

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
            originalResource.entities.push(currentEntity);
          } else {
            const currentResource = currentResourcesData.find(
              (x) => x.id === currentEntityChanged.targetResourceId
            );
            currentResource.entities = currentResource.entities?.filter(
              (x) => x.id !== currentEntity.id
            );
            currentEntityChanged.targetResourceId = targetParent.id;
            targetResource.entities.push(currentEntity);
          }
        } else {
          if (currentNode.data.originalParentNode !== currentNode.parentNode) {
            changes.movedEntities.push({
              entityId: currentNode.id,
              targetResourceId: targetParent.id,
              originalResourceId: currentNode.data.originalParentNode,
            });

            originalResource.entities = originalResource.entities.filter(
              (x) => x.id !== currentEntity.id
            );
            targetResource.entities.push(currentEntity);
          }
        }
      });

      const updatedNodes = await applyAutoLayout(
        nodes,
        edges,
        showRelationDetails
      );

      setNodes(updatedNodes);

      setChanges(changes);
      setCurrentResourcesData(currentResourcesData);
      saveToPersistentData();
    },
    [
      nodes,
      edges,
      showRelationDetails,
      changes,
      currentResourcesData,
      setCurrentDetailedEdges,
      setCurrentSimpleEdges,
      saveToPersistentData,
    ]
  );

  const [
    createResourceEntities,
    { loading: loadingCreateResourceAndEntities, error: createEntitiesError },
  ] = useMutation<modelChangesData>(CREATE_RESOURCE_ENTITIES, {});

  const applyChanges = useCallback(async () => {
    const { newServices, movedEntities } = changes;
    const mapServices = newServices.map((s) => {
      return {
        tempId: s.tempId,
        name: s.name,
      };
    });

    await createResourceEntities({
      variables: {
        data: {
          entitiesToCopy: movedEntities,
          modelGroupsResources: mapServices,
          projectId: projectId,
        },
      },
      onCompleted: async (data) => {
        resetChanges();
      },
      onError: (error) => {
        //@todo: show Errors
      },
    }).catch(console.error);
  }, [changes, createResourceEntities, projectId, resetChanges]);

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
    loadingCreateResourceAndEntities,
    setSearchPhrase,
    toggleShowRelationDetails,
    resetChanges,
    changes,
    createEntitiesError,
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
