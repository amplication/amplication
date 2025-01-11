import { memo, type FC } from "react";
import { type NodeProps } from "reactflow";

import * as models from "../../../models";
import { NodePayload } from "../types";
import ResourceNodeBase from "./ResourceNodeBase";

type ModelProps = Omit<NodeProps, "data"> & {
  data: NodePayload<models.Entity>;
};
const CLASS_NAME = "catalog-graph-resource-node";

const ResourceNode: FC<ModelProps> = memo(({ id }) => {
  return <ResourceNodeBase modelId={id} className={`${CLASS_NAME}--simple`} />;
});
ResourceNode.displayName = "ResourceNode";

export default ResourceNode;
