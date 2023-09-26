import "./EntitiesERD.scss";
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
import classNames from "classnames";
import relationEdge from "./edges/relationEdge";
import { entitiesToNodesAndEdges } from "./helpers";
import RelationMarkets from "./edges/relationMarkets";

export const CLASS_NAME = "entities-erd";
type TData = {
  entities: models.Entity[];
};

const nodeTypes = {
  model: ModelNode,
};

const edgeTypes = {
  relation: relationEdge,
};

const DATE_CREATED_FIELD = "createdAt";

export default function EntitiesERD({ resourceId }: { resourceId: string }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { loading, error } = useQuery<TData>(GET_ENTITIES, {
    variables: {
      id: resourceId,
      orderBy: {
        [DATE_CREATED_FIELD]: models.SortOrder.Asc,
      },
    },
    async onCompleted(data) {
      const { nodes, edges } = await entitiesToNodesAndEdges(data.entities);
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
        minZoom={0.1}
      >
        <Background color="grey" />
      </ReactFlow>
      <RelationMarkets />
    </div>
  );
}

export const GET_ENTITIES = gql`
  query getEntities($id: String!, $orderBy: EntityFieldOrderByInput) {
    entities(where: { resource: { id: $id } }) {
      id
      displayName
      fields(orderBy: $orderBy) {
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
`;
