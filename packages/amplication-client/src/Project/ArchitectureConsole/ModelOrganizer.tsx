import "reactflow/dist/style.css";
import "./ModelOrganizer.scss";
import {
  CircularProgress,
  Dialog,
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
} from "reactflow";
import * as models from "../../models";
import ModelOrganizerToolbar from "./ModelOrganizerToolbar";
import relationEdge from "./edges/relationEdge";
import RelationMarkets from "./edges/relationMarkets";
import simpleRelationEdge from "./edges/simpleRelationEdge";
import { findGroupByPosition } from "./helpers";
import useModelOrganization from "./hooks/useModelOrganizer";
import { applyAutoLayout } from "./layout";
import modelGroupNode from "./nodes/modelGroupNode";
import ModelNode from "./nodes/modelNode";
import ModelSimpleNode from "./nodes/modelSimpleNode";
import { NODE_TYPE_MODEL, NODE_TYPE_MODEL_GROUP, Node } from "./types";
import ModelsGroupsList from "./ModelsGroupsList";
import {
  EntitlementType,
  FeatureIndicatorContainer,
} from "../../Components/FeatureIndicatorContainer";
import { BillingFeature } from "@amplication/util-billing-types";
import { ModuleOrganizerDisabled } from "./ModuleOrganizerDisabled";
import ModelOrganizerConfirmation from "./ModelOrganizerConfirmation";

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
    moveNodeToParent,
    createNewTempService,
    modelGroupFilterChanged,
    searchPhraseChanged,
    setDraggableNodes,
    selectedNode,
    selectedResource,
    setSelectedNode,
    mergeNewResourcesChanges,
  } = useModelOrganization();

  const [currentDropTarget, setCurrentDropTarget] = useState<Node>(null);

  const [readOnly, setReadOnly] = useState<boolean>(true);
  const [confirmChanges, setConfirmChanges] = useState<boolean>(false);

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
    setSelectedNode(null);

    setReadOnly(true);
  }, [setReadOnly, setSelectedNode]);

  const onApplyPlanClick = useCallback(() => {
    saveChanges();
    setReadOnly(true);
    setConfirmChanges(false);
    setSelectedNode(null);
  }, [saveChanges, setSelectedNode, setReadOnly, setConfirmChanges]);

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      setReactFlowInstance(instance);
    },
    [setReactFlowInstance]
  );

  const handleServiceCreated = useCallback(
    (newResource: models.Resource) => {
      createNewTempService(newResource);
    },
    [nodes, setNodes]
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

        moveNodeToParent(node, currentDropTarget);
      }
      if (currentDropTarget) {
        currentDropTarget.data.isCurrentDropTarget = false;
      }
      setCurrentDropTarget(null);
    },
    [setNodes, edges, nodes, reactFlowInstance, showRelationDetails, changes]
  );

  const handleConfirmChangesState = useCallback(() => {
    setConfirmChanges(!confirmChanges);
  }, [confirmChanges, setConfirmChanges]);

  const onToggleShowRelationDetails = useCallback(async () => {
    await toggleShowRelationDetails();

    reactFlowInstance.fitView();
  }, [setNodes, reactFlowInstance, showRelationDetails, nodes, edges]);

  const onArrangeNodes = useCallback(async () => {
    const updatedNodes = await applyAutoLayout(
      nodes,
      edges,
      showRelationDetails
    );
    setNodes(updatedNodes);
    reactFlowInstance.fitView();
  }, [setNodes, showRelationDetails, reactFlowInstance, nodes, edges]);

  return (
    <div className={CLASS_NAME}>
      {loadingResources ? (
        <CircularProgress centerToParent />
      ) : (
        <>
          <Dialog
            isOpen={confirmChanges}
            onDismiss={handleConfirmChangesState}
            title="Confirm Architecture Changes"
          >
            <ModelOrganizerConfirmation
              onConfirmChanges={onApplyPlanClick}
              onCancelChanges={handleConfirmChangesState}
              changes={changes}
              selectedResource={selectedResource}
            ></ModelOrganizerConfirmation>
          </Dialog>

          <FeatureIndicatorContainer
            featureId={BillingFeature.RedesignArchitecture}
            entitlementType={EntitlementType.Boolean}
            render={({ disabled, icon }) => (
              <>
                {disabled && (
                  <ModuleOrganizerDisabled
                    icon={icon}
                    handleSearchChange={searchPhraseChanged}
                  />
                )}
              </>
            )}
          />
          <ModelOrganizerToolbar
            readOnly={readOnly}
            hasChanges={
              changes?.movedEntities?.length > 0 ||
              changes?.newServices?.length > 0
            }
            resources={currentResourcesData}
            onApplyPlan={handleConfirmChangesState}
            searchPhraseChanged={searchPhraseChanged}
            onRedesign={onRedesignClick}
          />

          <div className={`${CLASS_NAME}__body`}>
            <ModelsGroupsList
              modelGroups={nodes?.filter(
                (model) => model.type === "modelGroup"
              )}
              handleModelGroupFilterChanged={modelGroupFilterChanged}
              selectedNode={selectedNode}
              readOnly={readOnly}
              handleServiceCreated={handleServiceCreated}
              onCancelChanges={onCancelChangesClick}
              mergeNewResourcesChanges={mergeNewResourcesChanges}
            ></ModelsGroupsList>
            <div className={"reactflow-wrapper"}>
              <ReactFlow
                onInit={onInit}
                nodes={nodes}
                edges={edges}
                fitView
                nodeTypes={showRelationDetails ? nodeTypes : simpleNodeTypes}
                edgeTypes={edgeTypes}
                onNodeDrag={onNodeDrag}
                onNodeDragStop={onNodeDragStop}
                onEdgesChange={onEdgesChange}
                connectionMode={ConnectionMode.Loose}
                proOptions={{ hideAttribution: true }}
                minZoom={0.1}
                nodesDraggable={!readOnly}
              >
                <Background color="grey" />
                <Controls>
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

          <Snackbar open={Boolean(errorMessage)} message={errorMessage} />
        </>
      )}
    </div>
  );
}
