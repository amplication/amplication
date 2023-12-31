import "reactflow/dist/style.css";
import "./ModelOrganizer.scss";

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
  MiniMap,
  ReactFlow,
  ReactFlowInstance,
  useEdgesState,
} from "reactflow";
import * as models from "../../models";
import relationEdge from "./edges/relationEdge";
import RelationMarkets from "./edges/relationMarkets";
import simpleRelationEdge from "./edges/simpleRelationEdge";
import { entitiesToNodesAndEdges, findGroupByPosition } from "./helpers";
import { applyAutoLayout } from "./layout";
import modelGroupNode from "./nodes/modelGroupNode";
import ModelNode from "./nodes/modelNode";
import ModelSimpleNode from "./nodes/modelSimpleNode";
import {
  ModelChanges,
  NODE_TYPE_MODEL,
  NODE_TYPE_MODEL_GROUP,
  NODE_TYPE_MODEL_SIMPLE,
  Node,
  ResourceNode,
} from "./types";
import ModelOrganizerToolbar from "./ModelOrganizerToolbar";

export const CLASS_NAME = "model-organizer";

const nodeTypes = {
  model: ModelNode,
  modelGroup: modelGroupNode,
  modelSimple: ModelSimpleNode,
};

const edgeTypes = {
  relation: relationEdge,
  relationSimple: simpleRelationEdge,
};

type Props = {
  resources: models.Resource[];
  onApplyPlan: (changes: ModelChanges) => void;
  loadingResources: boolean;
  errorMessage: string;
};

export default function ModelOrganizer({
  resources,
  onApplyPlan,
  loadingResources,
  errorMessage,
}: Props) {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>(null);

  const [nodes, setNodes] = useState<Node[]>([]); // main data elements for save
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentDropTarget, setCurrentDropTarget] = useState<Node>(null);
  const [showRelationDetails, setShowRelationDetails] = useState(false);
  const [changes, setChanges] = useState<ModelChanges>({
    movedEntities: [],
    newServices: [],
  }); // main data elements for save

  const [readOnly, setReadOnly] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const onRedesignClick = useCallback(() => {
    setReadOnly(false);
  }, [setReadOnly]);

  const onCancelChangesClick = useCallback(() => {
    //todo: cancel changes
    setReadOnly(false);
  }, [setReadOnly]);

  useEffect(() => {
    const prepareNodes = async () => {
      const { nodes, edges } = await entitiesToNodesAndEdges(
        resources,
        showRelationDetails
      );

      const modelGroups = nodes.filter(
        (x) => x.type === NODE_TYPE_MODEL_GROUP
      ) as ResourceNode[];

      modelGroups.forEach((modelGroup) => {
        if (modelGroup.data.payload.tempId) {
          const newTempService = {
            id: modelGroup.data.payload.tempId,
            name: modelGroup.data.payload.name,
          };
          changes.newServices.push(newTempService);
          modelGroup.data.payload.tempId = null;
        }
        setChanges((changes) => changes);
      });

      setNodes(nodes);
      setEdges(edges);
    };

    if (resources && resources.length > 0) {
      prepareNodes().catch(console.error);
    } else {
      setNodes([]);
      setEdges([]);
    }
  }, [resources, setNodes, setEdges, showRelationDetails, setChanges, changes]);

  const onApplyPlanClick = useCallback(() => {
    onApplyPlan(changes);
    setReadOnly(true);
    setHasChanges(false);
    setChanges({
      movedEntities: [],
      newServices: [],
    });
  }, [onApplyPlan, setReadOnly, setChanges, changes]);

  const onInit = useCallback(
    (instance: ReactFlowInstance) => {
      setReactFlowInstance(instance);
    },
    [setReactFlowInstance]
  );

  const onNodeDrag = useCallback(
    async (
      event: React.MouseEvent,
      draggedNode: Node,
      draggedNodes: Node[]
    ) => {
      let targetGroup;

      if (
        draggedNode.type === NODE_TYPE_MODEL ||
        draggedNode.type === NODE_TYPE_MODEL_SIMPLE
      ) {
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

        node.parentNode = currentDropTarget.id;

        const currentEntityChanged = changes.movedEntities.find(
          (x) => x.entityId === node.id
        );

        if (
          !currentEntityChanged &&
          node.data.originalParentNode !== node.parentNode
        ) {
          const newEntity = {
            entityId: node.id,
            targetResourceId: currentDropTarget.id,
          };
          changes.movedEntities.push(newEntity);
        }

        if (
          currentEntityChanged &&
          node.data.originalParentNode !== node.parentNode
        ) {
          currentEntityChanged.targetResourceId = currentDropTarget.id;
        }

        if (
          currentEntityChanged &&
          node.data.originalParentNode === node.parentNode
        ) {
          changes.movedEntities = changes.movedEntities.filter(
            (x) => x.entityId !== currentEntityChanged.entityId
          );
        }

        setChanges((changes) => changes);
        if (changes.movedEntities.length < 1) {
          setHasChanges(false);
        } else {
          setHasChanges(true);
        }

        setNodes((nodes) => [...nodes]);
      }
      if (currentDropTarget) {
        currentDropTarget.data.isCurrentDropTarget = false;
      }
      setCurrentDropTarget(null);
    },
    [setNodes, edges, nodes, reactFlowInstance, showRelationDetails, changes]
  );

  const onToggleDetailsChange = useCallback(async () => {
    const { nodes, edges } = await entitiesToNodesAndEdges(
      resources,
      !showRelationDetails
    );
    setShowRelationDetails(!showRelationDetails);

    setNodes(nodes);
    setEdges(edges);
  }, [
    setNodes,
    setEdges,
    showRelationDetails,
    setShowRelationDetails,
    resources,
  ]);

  const onArrangeNodes = useCallback(async () => {
    const updatedNodes = await applyAutoLayout(
      nodes,
      edges,
      showRelationDetails
    );
    setNodes(updatedNodes);
    reactFlowInstance.fitView();
  }, [setNodes, showRelationDetails, nodes, edges]);

  return (
    <div className={CLASS_NAME}>
      {loadingResources ? (
        <CircularProgress centerToParent />
      ) : (
        <>
          <ModelOrganizerToolbar
            readOnly={readOnly}
            hasChanges={hasChanges}
            onApplyPlan={onApplyPlanClick}
            onRedesign={onRedesignClick}
            onCancelChanges={onCancelChangesClick}
          />
          <div className={"reactflow-wrapper"}>
            <ReactFlow
              onInit={onInit}
              nodes={nodes}
              edges={edges}
              fitView
              nodeTypes={nodeTypes}
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
                <ControlButton onClick={onToggleDetailsChange}>
                  <Icon icon="list" />
                </ControlButton>
                <ControlButton onClick={onArrangeNodes}>
                  <Icon icon="layers" />
                </ControlButton>
              </Controls>
              <MiniMap pannable={true} zoomable={true} />
            </ReactFlow>
            <RelationMarkets />
          </div>
          <Snackbar open={Boolean(errorMessage)} message={errorMessage} />
        </>
      )}
    </div>
  );
}
