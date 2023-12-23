import "./ArchitectureConsole.scss";
import "reactflow/dist/style.css";

import { gql, useQuery } from "@apollo/client";
import {
  Background,
  ConnectionMode,
  ReactFlow,
  useNodesState,
  useEdgesState,
} from "reactflow";
import * as models from "../../models";
import { CircularProgress, Snackbar } from "@amplication/ui/design-system";
import { formatError } from "../../util/error";
import ModelNode from "./nodes/modelNode";
import modelGroupNode from "./nodes/modelGroupNode";
import classNames from "classnames";
import relationEdge from "./edges/relationEdge";
import { entitiesToNodesAndEdges } from "./helpers";
import RelationMarkets from "./edges/relationMarkets";
import { useContext } from "react";
import { AppContext } from "../../context/appContext";

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

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { loading, error } = useQuery<TData>(GET_RESOURCES, {
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
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        connectionMode={ConnectionMode.Loose}
        proOptions={{ hideAttribution: true }}
        minZoom={0.1}
      >
        <Background color="grey" />
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
