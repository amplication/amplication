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
  useEdgesState,
} from "reactflow";
import { AppContext } from "../../context/appContext";
import * as models from "../../models";
import { formatError } from "../../util/error";
import relationEdge from "./edges/relationEdge";
import RelationMarkets from "./edges/relationMarkets";
import { entitiesToNodesAndEdges } from "./helpers";
import { applyAutoLayout } from "./layout";
import modelGroupNode from "./nodes/modelGroupNode";
import ModelNode from "./nodes/modelNode";
import { Node } from "./types";

export const CLASS_NAME = "entities-erd";
type TData = {
  resources: models.Resource[];
};

const nodeTypes = {
  model: ModelNode,
  modelGroup: modelGroupNode,
};

const edgeTypes = {
  relation: relationEdge,
};

const DATE_CREATED_FIELD = "createdAt";

export default function ArchitectureConsole() {
  const { currentProject } = useContext(AppContext);

  const [nodes, setNodes] = useState<Node[]>([]); // main data elements for save
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

  const handleNodeDrag = useCallback(
    async (
      event: React.MouseEvent,
      draggedNode: Node,
      draggedNodes: Node[]
    ) => {
      setNodes((nodes) => {
        const node = nodes.find((node) => node.id === draggedNode.id);
        if (node) {
          node.position = draggedNode.position;
        }
        return [...nodes];
      });
    },
    [setNodes]
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
      if (node.data.originalParentNode) {
        console.log("return to original parent");
        node.parentNode = draggedNode.data.originalParentNode;
        node.data.originalParentNode = undefined;
      } else {
        console.log("move to new parent");
        const targetGroup = nodes.find(
          (n) => n.parentNode !== node.parentNode && n.type === "model"
        )?.parentNode;

        node.data.originalParentNode = node.parentNode;
        node.parentNode = targetGroup;
      }
      console.log({ node });

      const updatedNodes = await applyAutoLayout(nodes, edges);
      setNodes(updatedNodes);
    },
    [setNodes, edges, nodes]
  );

  const { loading, error, data } = useQuery<TData>(GET_RESOURCES, {
    variables: {
      projectId: currentProject?.id,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },
    async onCompleted(data) {
      const { nodes, edges } = await entitiesToNodesAndEdges(data.resources);
      setNodes(nodes);
      setEdges(edges);
    },
    fetchPolicy: "no-cache",
  });

  const errorMessage = error && formatError(error);

  if (loading) return <CircularProgress centerToParent />;
  if (error) return <Snackbar open={Boolean(error)} message={errorMessage} />;

  return (
    <div className={classNames(CLASS_NAME, "reactflow-wrapper")}>
      <ReactFlow
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
          <ControlButton
            onClick={() => alert("Something magical just happened. ✨")}
          >
            <Icon icon="close" />
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
