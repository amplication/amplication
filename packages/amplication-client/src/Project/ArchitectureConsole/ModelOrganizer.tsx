import {
  Button,
  CircularProgress,
  Dialog,
  EnumFlexDirection,
  FlexItem,
} from "@amplication/ui/design-system";
import { EnumItemsAlign } from "@amplication/ui/design-system/components/FlexItem/FlexItem";
import { useCallback, useEffect, useState } from "react";
import {
  Background,
  ConnectionMode,
  ReactFlow,
  ReactFlowInstance,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import * as models from "../../models";
import "./ModelOrganizer.scss";
import ModelOrganizerControls from "./ModelOrganizerControls";
import ModelOrganizerToolbar from "./ModelOrganizerToolbar";
import ModelsGroupsList from "./ModelsGroupsList";
import relationEdge from "./edges/relationEdge";
import RelationMarkets from "./edges/relationMarkets";
import simpleRelationEdge from "./edges/simpleRelationEdge";
import { findGroupByPosition } from "./helpers";
import useModelOrganization from "./hooks/useModelOrganizer";
import modelGroupNode from "./nodes/modelGroupNode";
import ModelNode from "./nodes/modelNode";
import ModelSimpleNode from "./nodes/modelSimpleNode";
import {
  NODE_TYPE_MODEL,
  NODE_TYPE_MODEL_GROUP,
  Node,
  NodePayloadWithPayloadType,
} from "./types";

export const CLASS_NAME = "model-organizer";
const REACT_FLOW_CLASS_NAME = "reactflow-wrapper";

const nodeTypes = {
  model: ModelNode,
  modelGroup: modelGroupNode,
};

const simpleNodeTypes = {
  model: ModelSimpleNode,
  modelGroup: modelGroupNode,
};

const edgeTypes = {
  relation: relationEdge,
  relationSimple: simpleRelationEdge,
};

type Props = {
  loadingResources?: boolean;
  errorMessage?: string;
};

export default function ModelOrganizer({
  loadingResources,
  errorMessage,
}: Props) {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>(null);

  const {
    nodes,
    currentResourcesData,
    setNodes,
    edges,
    onEdgesChange,
    showRelationDetails,
    toggleShowRelationDetails,
    resetToOriginalState,
    changes,
    saveChanges,
    loadingCreateResourceAndEntities,
    moveNodeToParent,
    createNewTempService,
    modelGroupFilterChanged,
    searchPhraseChanged,
    setDraggableNodes,
    mergeNewResourcesChanges,
    createEntitiesError,
  } = useModelOrganization();

  const [currentDropTarget, setCurrentDropTarget] = useState<Node>(null);

  const [readOnly, setReadOnly] = useState<boolean>(true);

  const [isValidResourceName, setIsValidResourceName] = useState<boolean>(true);

  const onNodesChange = useCallback(
    (changes) => {
      const updatedNodes = applyNodeChanges<NodePayloadWithPayloadType>(
        changes,
        nodes
      );
      setNodes(updatedNodes as Node[]);
    },
    [nodes, setNodes]
  );

  const handleCreateResourceState = useCallback(() => {
    setIsValidResourceName(true);
  }, [setIsValidResourceName]);

  useEffect(() => {
    if (
      changes?.movedEntities?.length > 0 ||
      changes?.newServices?.length > 0
    ) {
      setReadOnly(false);
    }
  }, [changes, setReadOnly]);

  const onRedesignClick = useCallback(
    (resource: models.Resource) => {
      setDraggableNodes(resource);

      setReadOnly(false);
    },
    [setReadOnly, setDraggableNodes]
  );

  const onCancelChangesClick = useCallback(() => {
    resetToOriginalState();

    setReadOnly(true);
  }, [resetToOriginalState]);

  const onApplyPlanClick = useCallback(() => {
    saveChanges();
    setReadOnly(true);
  }, [saveChanges, setReadOnly]);

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      if (!instance) return;
      setReactFlowInstance(instance);
    },
    [setReactFlowInstance]
  );

  const handleServiceCreated = useCallback(
    (newResource: models.Resource) => {
      let isValidName = true;
      currentResourcesData.forEach((r) => {
        if (
          r.name.trim().toLowerCase() === newResource.name.trim().toLowerCase()
        ) {
          isValidName = false;
          setIsValidResourceName(false);
          return;
        }
      });
      if (isValidName) {
        setIsValidResourceName(true);
        createNewTempService(newResource);
      }
    },
    [createNewTempService, setIsValidResourceName, currentResourcesData]
  );

  const onNodeDrag = useCallback(
    async (
      event: React.MouseEvent,
      draggedNode: Node,
      draggedNodes: Node[]
    ) => {
      let targetGroup;

      if (draggedNode.type === NODE_TYPE_MODEL) {
        const dropPosition = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        targetGroup = findGroupByPosition(nodes, dropPosition);
        if (targetGroup?.id !== draggedNode.parentNode) {
          setCurrentDropTarget(targetGroup);
        } else {
          setCurrentDropTarget(null);
          targetGroup = null;
        }
      }

      setNodes((nodes) => {
        nodes.forEach((node) => {
          if (node.id === draggedNode.id) {
            node.position = draggedNode.position;
          }
          node.data.isCurrentDropTarget = node.id === targetGroup?.id;
        });

        return [...nodes];
      });
    },
    [setNodes, reactFlowInstance, nodes]
  );

  const onNodeDragStop = useCallback(
    async (
      event: React.MouseEvent,
      draggedNode: Node,
      draggedNodes: Node[]
    ) => {
      if (draggedNode.type === NODE_TYPE_MODEL_GROUP) {
        return;
      }

      const node = nodes.find((node) => node.id === draggedNode.id);

      if (currentDropTarget && currentDropTarget.id !== node.parentNode) {
        const dropPosition = reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        node.position = {
          x: dropPosition.x - currentDropTarget.position.x,
          y: dropPosition.y - currentDropTarget.position.y,
        };

        currentDropTarget.data.isCurrentDropTarget = false;

        moveNodeToParent(draggedNodes, currentDropTarget);
      }
      if (currentDropTarget) {
        currentDropTarget.data.isCurrentDropTarget = false;
      }
      setCurrentDropTarget(null);
      setNodes([...nodes]);
    },
    [nodes, currentDropTarget, setNodes, reactFlowInstance, moveNodeToParent]
  );

  const onToggleShowRelationDetails = useCallback(async () => {
    await toggleShowRelationDetails();

    reactFlowInstance.fitView();
  }, [toggleShowRelationDetails, reactFlowInstance]);

  return (
    <div className={CLASS_NAME}>
      {loadingResources ? (
        <CircularProgress centerToParent />
      ) : (
        <>
          <div className={`${CLASS_NAME}__container`}>
            <div className={`${CLASS_NAME}__side_toolbar`}>
              <ModelsGroupsList
                nodes={nodes}
                handleModelGroupFilterChanged={modelGroupFilterChanged}
              ></ModelsGroupsList>
              <ModelOrganizerControls
                onToggleShowRelationDetails={onToggleShowRelationDetails}
                reactFlowInstance={reactFlowInstance}
              />
            </div>
            <div className={`${CLASS_NAME}__body`}>
              <ModelOrganizerToolbar
                changes={changes}
                nodes={nodes}
                readOnly={readOnly}
                hasChanges={
                  changes?.movedEntities?.length > 0 ||
                  changes?.newServices?.length > 0
                }
                loadingCreateResourceAndEntities={
                  loadingCreateResourceAndEntities
                }
                resources={currentResourcesData}
                onApplyPlan={onApplyPlanClick}
                searchPhraseChanged={searchPhraseChanged}
                onRedesign={onRedesignClick}
                handleServiceCreated={handleServiceCreated}
                onCancelChanges={onCancelChangesClick}
                mergeNewResourcesChanges={mergeNewResourcesChanges}
                createEntitiesError={Boolean(createEntitiesError)}
              />
              <Dialog
                isOpen={!isValidResourceName}
                onDismiss={handleCreateResourceState}
              >
                <FlexItem
                  direction={EnumFlexDirection.Column}
                  itemsAlign={EnumItemsAlign.Center}
                >
                  <span>
                    The service name already exists. Please choose a different
                    name.
                  </span>
                  <Button onClick={handleCreateResourceState}>Ok</Button>
                </FlexItem>
              </Dialog>
              <div className={REACT_FLOW_CLASS_NAME}>
                <ReactFlow
                  onInit={onInit}
                  nodes={nodes}
                  edges={edges}
                  fitView
                  nodeTypes={showRelationDetails ? nodeTypes : simpleNodeTypes}
                  edgeTypes={edgeTypes}
                  onNodesChange={onNodesChange}
                  onNodeDrag={onNodeDrag}
                  onNodeDragStop={onNodeDragStop}
                  onEdgesChange={onEdgesChange}
                  connectionMode={ConnectionMode.Loose}
                  proOptions={{ hideAttribution: true }}
                  minZoom={0.1}
                  panOnScroll
                  selectionKeyCode={null}
                >
                  <Background color="grey" />
                </ReactFlow>
                <RelationMarkets />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
