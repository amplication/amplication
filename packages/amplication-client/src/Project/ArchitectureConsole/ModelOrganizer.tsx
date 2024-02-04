import {
  Button,
  Dialog,
  EnumFlexDirection,
  FlexItem,
  Snackbar,
} from "@amplication/ui/design-system";
import { EnumItemsAlign } from "@amplication/ui/design-system/components/FlexItem/FlexItem";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Background,
  ConnectionMode,
  ReactFlow,
  ReactFlowInstance,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";
import { useAppContext } from "../../context/appContext";
import * as models from "../../models";
import useMessage from "../../util/useMessage";
import "./ModelOrganizer.scss";
import ModelOrganizerControls from "./ModelOrganizerControls";
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
const REACT_FLOW_CLASS_NAME = "reactflow-wrapper";
const MESSAGE_AUTO_HIDE_DURATION = 3000;

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

export default function ModelOrganizer() {
  const { currentProject } = useAppContext();

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>(null);

  const { message, messageType, showMessage, removeMessage } = useMessage();

  const {
    nodes,
    currentResourcesData,
    setNodes,
    edges,
    onEdgesChange,
    showRelationDetails,
    toggleShowRelationDetails,
    resetChanges,
    changes,
    applyChanges,
    applyChangesLoading,
    applyChangesError,
    applyChangesData,
    moveNodeToParent,
    createNewTempService,
    modelGroupFilterChanged,
    searchPhraseChanged,
    setCurrentEditableResource,
    mergeNewResourcesChanges,
    redesignMode,
  } = useModelOrganization({
    projectId: currentProject?.id,
    onMessage: showMessage,
  });

  const [currentDropTarget, setCurrentDropTarget] = useState<Node>(null);

  const [isValidResourceName, setIsValidResourceName] = useState<boolean>(true);

  const fitViewTimerRef = useRef(null);

  const fitToView = useCallback(
    (delayBeforeStart = 100) => {
      if (reactFlowInstance) {
        if (delayBeforeStart > 0) {
          fitViewTimerRef.current = setTimeout(() => {
            reactFlowInstance.fitView({ duration: 1000 });
          }, delayBeforeStart);
        } else {
          reactFlowInstance.fitView({ duration: 1000 });
        }
      }
    },
    [reactFlowInstance]
  );

  useEffect(() => {
    // Clear the timeout ref when the component unmounts
    return () => clearTimeout(fitViewTimerRef.current);
  }, []);

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

  const onRedesignClick = useCallback(
    (resource: models.Resource) => {
      setCurrentEditableResource(resource);
    },
    [setCurrentEditableResource]
  );

  const onCancelChangesClick = useCallback(() => {
    resetChanges();
  }, [resetChanges]);

  const onApplyPlanClick = useCallback(() => {
    applyChanges();
  }, [applyChanges]);

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      if (!instance) return;
      setReactFlowInstance(instance);
    },
    [setReactFlowInstance]
  );

  const handleServiceCreated = useCallback(
    async (newResource: models.Resource) => {
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
        await createNewTempService(newResource);

        fitToView();
      }
    },
    [currentResourcesData, createNewTempService, fitToView]
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
    fitToView();
  }, [fitToView, toggleShowRelationDetails]);

  const onArrangeNodes = useCallback(async () => {
    const updatedNodes = await applyAutoLayout(
      nodes,
      edges,
      showRelationDetails
    );
    setNodes(updatedNodes);
    fitToView();
  }, [nodes, edges, showRelationDetails, setNodes, fitToView]);

  return (
    <div className={CLASS_NAME}>
      <>
        <div className={`${CLASS_NAME}__container`}>
          <div className={`${CLASS_NAME}__side_toolbar`}>
            <ModelsGroupsList
              nodes={nodes}
              handleModelGroupFilterChanged={modelGroupFilterChanged}
            ></ModelsGroupsList>
            <ModelOrganizerControls
              onToggleShowRelationDetails={onToggleShowRelationDetails}
              onArrangeNodes={onArrangeNodes}
              reactFlowInstance={reactFlowInstance}
            />
          </div>
          <div className={`${CLASS_NAME}__body`}>
            <ModelOrganizerToolbar
              changes={changes}
              nodes={nodes}
              redesignMode={redesignMode}
              hasChanges={
                changes?.movedEntities?.length > 0 ||
                changes?.newServices?.length > 0
              }
              applyChangesLoading={applyChangesLoading}
              resources={currentResourcesData}
              onApplyPlan={onApplyPlanClick}
              searchPhraseChanged={searchPhraseChanged}
              onRedesign={onRedesignClick}
              handleServiceCreated={handleServiceCreated}
              onCancelChanges={onCancelChangesClick}
              mergeNewResourcesChanges={mergeNewResourcesChanges}
              applyChangesError={applyChangesError}
              applyChangesData={applyChangesData}
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
          <Snackbar
            open={Boolean(message)}
            message={message}
            messageType={messageType}
            autoHideDuration={MESSAGE_AUTO_HIDE_DURATION}
            onClose={removeMessage}
          />
        </div>
      </>
    </div>
  );
}
