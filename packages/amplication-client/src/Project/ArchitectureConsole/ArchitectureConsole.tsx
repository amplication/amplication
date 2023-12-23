import "reactflow/dist/style.css";
import "./ArchitectureConsole.scss";

import {
  CircularProgress,
  Icon,
  Snackbar,
} from "@amplication/ui/design-system";
import { gql, useQuery } from "@apollo/client";
import classNames from "classnames";
import { useCallback, useContext, useState } from "react";
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
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { formatError } from "../../util/error";
import relationEdge from "./edges/relationEdge";
import simpleRelationEdge from "./edges/simpleRelationEdge";
import RelationMarkets from "./edges/relationMarkets";
import {
  entitiesToNodesAndEdges,
  findGroupByPosition,
  getGroupNodes,
} from "./helpers";
import { applyAutoLayout } from "./layout";
import modelGroupNode from "./nodes/modelGroupNode";
import ModelNode from "./nodes/modelNode";
import ModelSimpleNode from "./nodes/modelSimpleNode";
import { Node } from "./types";
import { use } from "ast-types";

export const CLASS_NAME = "entities-erd";
type TData = {
  resources: models.Resource[];
};

const nodeTypes = {
  model: ModelNode,
  modelGroup: modelGroupNode,
  modelSimple: ModelSimpleNode,
};

const edgeTypes = {
  relation: relationEdge,
  relationSimple: simpleRelationEdge,
};

const DATE_CREATED_FIELD = "createdAt";

export default function ArchitectureConsole() {
  const { currentProject } = useContext(AppContext);

  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance>(null);

  const [nodes, setNodes] = useState<Node[]>([]); // main data elements for save
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [currentDropTarget, setCurrentDropTarget] = useState<Node>(null);
  const [showRelationDetails, setShowRelationDetails] = useState(false);
  const [resources, setResources] = useState<models.Resource[]>([]);

  // const handleNodesChange = useCallback((changes: NodeChange[]) => {
  //   if (changes[0].type === "position") {
  //     const change = changes[0] as NodePositionChange;
  //     console.log("handleNodesChange", { changes });

  //     if (change.dragging) {
  //       setNodes((nodes) => {
  //         const node = nodes.find((node) => node.id === change.id);
  //         if (node) {
  //           node.position = change.position;
  //         }
  //         return [...nodes];
  //       });
  //     }
  //   }
  // }, []);

  const onInit = useCallback((instance: ReactFlowInstance) => {
    setReactFlowInstance(instance);
  }, []);

  const handleNodeDrag = useCallback(
    async (
      event: React.MouseEvent,
      draggedNode: Node,
      draggedNodes: Node[]
    ) => {
      let targetGroup;

      if (draggedNode.type === "model" || draggedNode.type === "modelSimple") {
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

  const handleNodeDragStop = useCallback(
    async (
      event: React.MouseEvent,
      draggedNode: Node,
      draggedNodes: Node[]
    ) => {
      if (draggedNode.type === "modelGroup") {
        return;
      }

      const node = nodes.find((node) => node.id === draggedNode.id);

      //return to original parent
      // if (node.data.originalParentNode) {
      //   node.parentNode = draggedNode.data.originalParentNode;
      //   node.data.originalParentNode = undefined;
      // } else {

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
      //}
      if (currentDropTarget) {
        currentDropTarget.data.isCurrentDropTarget = false;
      }
      setCurrentDropTarget(null);
    },
    [setNodes, edges, nodes, reactFlowInstance, showRelationDetails]
  );

  const { loading, error, data } = useQuery<TData>(GET_RESOURCES, {
    variables: {
      projectId: currentProject?.id,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },
    async onCompleted(data) {
      setResources(data.resources);
      const { nodes, edges } = await entitiesToNodesAndEdges(
        data.resources,
        showRelationDetails
      );
      setNodes(nodes);
      setEdges(edges);
    },
    fetchPolicy: "no-cache",
  });

  const toggleDetails = useCallback(async () => {
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

  const arrangeNodes = useCallback(async () => {
    const updatedNodes = await applyAutoLayout(
      nodes,
      edges,
      showRelationDetails
    );
    setNodes(updatedNodes);
    reactFlowInstance.fitView();
  }, [setNodes, showRelationDetails, nodes, edges]);

  const errorMessage = error && formatError(error);

  if (loading) return <CircularProgress centerToParent />;
  if (error) return <Snackbar open={Boolean(error)} message={errorMessage} />;

  return (
    <div className={classNames(CLASS_NAME, "reactflow-wrapper")}>
      <ReactFlow
        onInit={onInit}
        nodes={nodes}
        edges={edges}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodeDrag={handleNodeDrag}
        onNodeDragStop={handleNodeDragStop}
        //onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        connectionMode={ConnectionMode.Loose}
        proOptions={{ hideAttribution: true }}
        minZoom={0.1}
      >
        <Background color="grey" />
        <Controls>
          <ControlButton onClick={toggleDetails}>
            <Icon icon="close" />
          </ControlButton>
          <ControlButton onClick={arrangeNodes}>
            <Icon icon="star" />
          </ControlButton>
        </Controls>
        <MiniMap pannable={true} zoomable={true} />
      </ReactFlow>
      <RelationMarkets />
    </div>
  );
}

export const GET_RESOURCES = gql`
  query getResources($projectId: String!) {
    resources(
      where: { project: { id: $projectId }, resourceType: { equals: Service } }
    ) {
      id
      name
      entities {
        id
        displayName
        resourceId
        fields {
          permanentId
          displayName
          description
          properties
          dataType
          customAttributes
          required
          unique
        }
      }
    }
  }
`;
