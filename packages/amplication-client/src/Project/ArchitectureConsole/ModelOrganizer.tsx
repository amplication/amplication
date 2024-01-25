import {
  CircularProgress,
  Icon,
  Snackbar,
} from "@amplication/ui/design-system";
import { useCallback, useEffect, useState } from "react";
import {
  Background,
  ConnectionMode,
  ControlButton,
  Controls,
  ReactFlow,
  ReactFlowInstance,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import * as models from "../../models";
import "./ModelOrganizer.scss";
import ModelOrganizerToolbar from "./ModelOrganizerToolbar";
import ModelsGroupsList from "./ModelsGroupsList";
import relationEdge from "./edges/relationEdge";
import RelationMarkets from "./edges/relationMarkets";
import simpleRelationEdge from "./edges/simpleRelationEdge";
import { findGroupByPosition } from "./helpers";
import useModelOrganization from "./hooks/useModelOrganizer";
import { applyAutoLayout } from "./layout";
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
  } = useModelOrganization();

  const [currentDropTarget, setCurrentDropTarget] = useState<Node>(null);

  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [zoom, setZoom] = useState<string>(null);

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
      createNewTempService(newResource);
    },
    [createNewTempService]
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
          console.log("settings drop target");
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
        moveNodeToParent(node, currentDropTarget);
      }
      if (currentDropTarget) {
        console.log("clearing drop target");
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

  const onToggleZoomInRelationDetails = useCallback(async () => {
    await reactFlowInstance.zoomIn();

    setZoom((reactFlowInstance.getZoom() * 100).toFixed());
  }, [setZoom, reactFlowInstance]);

  const onToggleZoomOutRelationDetails = useCallback(async () => {
    await reactFlowInstance.zoomOut();
    setZoom((reactFlowInstance.getZoom() * 100).toFixed());
  }, [setZoom, reactFlowInstance]);

  const onArrangeNodes = useCallback(async () => {
    const updatedNodes = await applyAutoLayout(
      nodes,
      edges,
      showRelationDetails
    );
    setNodes(updatedNodes);
    reactFlowInstance.fitView();
  }, [setNodes, showRelationDetails, reactFlowInstance, nodes, edges]);

  if (loadingCreateResourceAndEntities)
    return <CircularProgress centerToParent />;

  return (
    <div className={CLASS_NAME}>
      {loadingResources ? (
        <CircularProgress centerToParent />
      ) : (
        <>
          <div className={`${CLASS_NAME}__container`}>
            <ModelsGroupsList
              nodes={nodes}
              handleModelGroupFilterChanged={modelGroupFilterChanged}
            ></ModelsGroupsList>
            <div className={`${CLASS_NAME}__body`}>
              <ModelOrganizerToolbar
                changes={changes}
                nodes={nodes}
                readOnly={readOnly}
                hasChanges={
                  changes?.movedEntities?.length > 0 ||
                  changes?.newServices?.length > 0
                }
                resources={currentResourcesData}
                onApplyPlan={onApplyPlanClick}
                searchPhraseChanged={searchPhraseChanged}
                onRedesign={onRedesignClick}
                handleServiceCreated={handleServiceCreated}
                onCancelChanges={onCancelChangesClick}
                mergeNewResourcesChanges={mergeNewResourcesChanges}
              />

              <div className={"reactflow-wrapper"}>
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
                >
                  <Background color="grey" />
                  <Controls
                    showInteractive={false}
                    showFitView={false}
                    showZoom={false}
                  >
                    <ControlButton onClick={onToggleZoomInRelationDetails}>
                      <Icon icon="plus" />
                    </ControlButton>

                    <ControlButton onClick={onToggleZoomOutRelationDetails}>
                      <Icon icon="minus" />
                    </ControlButton>

                    <ControlButton onClick={onToggleShowRelationDetails}>
                      <Icon icon="list" />
                    </ControlButton>
                    <ControlButton onClick={onArrangeNodes}>
                      <Icon icon="layers" />
                    </ControlButton>
                  </Controls>

                  {/* <MiniMap pannable={true} zoomable={true} /> */}
                </ReactFlow>
                <RelationMarkets />
              </div>
            </div>
          </div>

          <Snackbar open={Boolean(errorMessage)} message={errorMessage} />
        </>
      )}
    </div>
  );
}
