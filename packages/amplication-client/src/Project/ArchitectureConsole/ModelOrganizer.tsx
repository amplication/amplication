import "reactflow/dist/style.css";
import "./ModelOrganizer.scss";

import { Icon } from "@amplication/ui/design-system";
import classNames from "classnames";
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
  NODE_TYPE_MODEL,
  NODE_TYPE_MODEL_GROUP,
  NODE_TYPE_MODEL_SIMPLE,
  Node,
} from "./types";

export const CLASS_NAME = "architecture-console";

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
};

export default function ModelOrganizer({ resources }: Props) {
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>(null);

  const [nodes, setNodes] = useState<Node[]>([]); // main data elements for save
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentDropTarget, setCurrentDropTarget] = useState<Node>(null);
  const [showRelationDetails, setShowRelationDetails] = useState(false);

  useEffect(() => {
    const prepareNodes = async () => {
      const { nodes, edges } = await entitiesToNodesAndEdges(
        resources,
        showRelationDetails
      );
      setNodes(nodes);
      setEdges(edges);
    };

    if (resources && resources.length > 0) {
      prepareNodes().catch(console.error);
    }
  }, [resources, setNodes, setEdges, showRelationDetails]);

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

        if (node.data.originalParentNode === currentDropTarget.id) {
          node.data.originalParentNode = undefined;
        } else {
          node.data.originalParentNode = node.parentNode;
        }

        node.parentNode = currentDropTarget.id;

        setNodes((nodes) => [...nodes]);
      }
      if (currentDropTarget) {
        currentDropTarget.data.isCurrentDropTarget = false;
      }
      setCurrentDropTarget(null);
    },
    [setNodes, edges, nodes, reactFlowInstance, showRelationDetails]
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
    <div className={classNames(CLASS_NAME, "reactflow-wrapper")}>
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
  );
}
